export const API_BASE = "https://catalog-api.muvassirwork.workers.dev";

// Must match the Cloudflare worker exactly
const TOKEN_SECRET = "cybzone";

function getISOWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
}

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getCatalogUrl(): Promise<string> {
  const now = new Date();
  // Worker uses date.getFullYear() (local) — mirror that to stay in sync.
  const year = now.getFullYear();
  const week = getISOWeekNumber(now);
  const token = await sha256Hex(`${TOKEN_SECRET}${year}${week}`);
  return `${API_BASE}/?t=${token}`;
}

// WhatsApp number in international format, no + or spaces
export const WHATSAPP_NUMBER = "917558998847";

export const BRAND_NAME = "Catalog";

// Optional fields some products may have
export type ProductExtra = {
  original_price?: number | string;
  offer_price?: number | string;
  rating?: number;
  reviews?: number;
  brand?: string;
  images?: string[];
};

export type Pricing = {
  display: number;
  original: number | null;
  discountPct: number;
  hasDeal: boolean;
};

export function getPricing(
  product: Pick<Product, "price"> & Partial<Pick<ProductExtra, "offer_price" | "original_price">>,
): Pricing {
  const price = parsePrice(product.price);
  const offer = product.offer_price !== undefined ? parsePrice(product.offer_price) : NaN;
  const orig = product.original_price !== undefined ? parsePrice(product.original_price) : NaN;

  // Case 1: offer_price exists and is a discount on price
  if (Number.isFinite(offer) && offer > 0 && offer < price) {
    const pct = Math.round(((price - offer) / price) * 100);
    return { display: offer, original: price, discountPct: pct, hasDeal: pct > 0 };
  }
  // Case 2: original_price exists and is higher than price
  if (Number.isFinite(orig) && orig > price && price > 0) {
    const pct = Math.round(((orig - price) / orig) * 100);
    return { display: price, original: orig, discountPct: pct, hasDeal: pct > 0 };
  }
  return { display: price, original: null, discountPct: 0, hasDeal: false };
}

export type Product = {
  id: string | number;
  name: string;
  price: number | string;
  image_url: string;
  description: string;
  category: string;
} & ProductExtra;

export class ExpiredLinkError extends Error {
  constructor(message = "This catalog link has expired or is invalid.") {
    super(message);
    this.name = "ExpiredLinkError";
  }
}

export async function fetchProducts(): Promise<Product[]> {
  let res: Response;
  try {
    const url = await getCatalogUrl();
    res = await fetch(url);
  } catch {
    throw new Error("Network error");
  }

  // Treat auth-style failures as an expired/invalid token link
  if (res.status === 401 || res.status === 403 || res.status === 404) {
    throw new ExpiredLinkError();
  }
  if (!res.ok) throw new Error(`Failed to load catalog (${res.status})`);

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid response from server");
  }

  // Some APIs return 200 with an error body for expired tokens
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    const msg = String(obj.error ?? obj.message ?? "").toLowerCase();
    if (msg.includes("expire") || msg.includes("invalid token") || msg.includes("unauthorized")) {
      throw new ExpiredLinkError();
    }
  }

  const list: Product[] = Array.isArray(data)
    ? (data as Product[])
    : ((data as { products?: Product[] })?.products ?? []);
  return list;
}

export function parsePrice(price: number | string | undefined | null): number {
  if (price === undefined || price === null) return 0;
  if (typeof price === "number") return Number.isFinite(price) ? price : 0;
  // Strip currency symbols, commas, spaces — keep digits, dot, minus
  const cleaned = String(price).replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function formatPrice(price: number | string) {
  const n = parsePrice(price);
  if (Number.isFinite(n)) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  }
  return String(price);
}

export function whatsappLink(
  product: Pick<Product, "name" | "price">,
  details: WhatsappOrderDetails = {},
) {
  const lines = [
    `Hi, I'm interested in ${product.name} (${formatPrice(product.price)})`,
  ];
  if (details.name) lines.push(`Name: ${details.name}`);
  if (details.pincode) lines.push(`Pincode: ${details.pincode}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export type WhatsappOrderItem = {
  name: string;
  price: number | string;
  qty: number;
};

export type WhatsappOrderDetails = {
  name?: string;
  pincode?: string;
};

export function whatsappOrderLink(
  items: WhatsappOrderItem[],
  details: WhatsappOrderDetails = {},
) {
  if (!items.length) {
    return `https://wa.me/${WHATSAPP_NUMBER}`;
  }
  const lines = items.map(
    (it, i) =>
      `${i + 1}. ${it.name} × ${it.qty} — ${formatPrice(
        Number(it.price) * it.qty,
      )}`,
  );
  const total = items.reduce(
    (acc, it) => acc + Number(it.price) * it.qty,
    0,
  );
  const customerLines: string[] = [];
  if (details.name) customerLines.push(`Name: ${details.name}`);
  if (details.pincode) customerLines.push(`Pincode: ${details.pincode}`);
  const text = [
    "Hi! I'd like to place an order:",
    "",
    ...lines,
    "",
    `Total: ${formatPrice(total)}`,
    ...(customerLines.length ? ["", ...customerLines] : []),
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function whatsappFreshLinkRequest() {
  const text = "Hi, my catalog link has expired. Could you please send me a fresh link?";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const API_URL =
  "https://catalog-api.muvassirwork.workers.dev/?t=c13e98de2ebfafd2ce6b9716347e305fdc16d01a5d8885f20824a7c16042cfc3";

// WhatsApp number in international format, no + or spaces
export const WHATSAPP_NUMBER = "917558998847";

export const BRAND_NAME = "Catalog";

// Optional fields some products may have
export type ProductExtra = {
  original_price?: number | string;
  rating?: number;
  reviews?: number;
  brand?: string;
  images?: string[];
};

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
    res = await fetch(API_URL);
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

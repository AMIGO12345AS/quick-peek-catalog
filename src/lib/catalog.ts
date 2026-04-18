export const API_URL =
  "https://catalog-api.muvassirwork.workers.dev/?t=c13e98de2ebfafd2ce6b9716347e305fdc16d01a5d8885f20824a7c16042cfc3";

// TODO: replace with the real WhatsApp number (international format, no + or spaces)
export const WHATSAPP_NUMBER = "10000000000";

export const BRAND_NAME = "Catalog";

export type Product = {
  id: string | number;
  name: string;
  price: number | string;
  image_url: string;
  description: string;
  category: string;
};

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

export function formatPrice(price: number | string) {
  const n = typeof price === "number" ? price : Number(price);
  if (Number.isFinite(n)) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n);
  }
  return String(price);
}

export function whatsappLink(product: Pick<Product, "name" | "price">) {
  const text = `Hi, I'm interested in ${product.name} (${formatPrice(product.price)})`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function whatsappFreshLinkRequest() {
  const text = "Hi, my catalog link has expired. Could you please send me a fresh link?";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

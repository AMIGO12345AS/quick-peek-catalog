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

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Failed to load catalog (${res.status})`);
  const data = await res.json();
  // Be tolerant: API may return array or { products: [...] }
  const list: Product[] = Array.isArray(data) ? data : data.products ?? [];
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

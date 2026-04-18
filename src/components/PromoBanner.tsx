import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductImage } from "./ProductImage";
import { cn } from "@/lib/utils";
import { getPricing, type Product } from "@/lib/catalog";

type Props = {
  product?: Product;
  products?: Product[];
  intervalMs?: number;
};

export const PromoBanner = ({ product, products, intervalMs = 4500 }: Props) => {
  // Build the rotation list: prefer `products`, fall back to single `product`
  const list: Product[] = (products && products.length > 0 ? products : product ? [product] : []).slice(0, 3);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Reset index if list shrinks
  useEffect(() => {
    if (index >= list.length) setIndex(0);
  }, [list.length, index]);

  // Auto-rotate with a quick fade-out → swap → fade-in
  useEffect(() => {
    if (list.length < 2) return;
    const fadeMs = 250;
    const interval = setInterval(() => {
      setVisible(false);
      const t = setTimeout(() => {
        setIndex((i) => (i + 1) % list.length);
        setVisible(true);
      }, fadeMs);
      return () => clearTimeout(t);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [list.length, intervalMs]);

  const active = list[index];
  const pct = active ? getPricing(active).discountPct : 0;
  const displayPct = pct > 0 ? pct : 20;

  return (
    <section aria-label="Promotion" className="overflow-hidden rounded-2xl bg-gradient-banner shadow-card">
      <div className="grid grid-cols-[1.1fr_1fr] items-stretch">
        <div className="flex flex-col justify-between gap-3 p-5 sm:p-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/70">
              New Collections
            </p>
            <p
              key={`pct-${displayPct}-${index}`}
              className="mt-1 text-3xl font-extrabold leading-none tracking-tight text-foreground animate-fade-in sm:text-4xl"
            >
              {displayPct}
              <span className="align-top text-base font-bold">%</span> OFF
            </p>
            {active && (
              <p
                key={`name-${active.id}`}
                className="mt-2 line-clamp-1 text-xs font-semibold text-foreground/70 animate-fade-in sm:text-sm"
              >
                {active.name}
              </p>
            )}
          </div>
          {active ? (
            <Link
              to={`/product/${active.id}`}
              className="inline-flex w-fit items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background shadow-soft transition-transform hover:-translate-y-0.5 sm:text-sm"
            >
              SHOP NOW
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <a
              href="#all-products"
              className="inline-flex w-fit items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background shadow-soft sm:text-sm"
            >
              SHOP NOW
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          )}
          {list.length > 1 && (
            <div className="flex items-center gap-1.5" aria-hidden>
              {list.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index ? "w-5 bg-foreground" : "w-1.5 bg-foreground/30",
                  )}
                />
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          {active ? (
            <div
              className={cn(
                "h-full w-full transition-opacity duration-300",
                visible ? "opacity-100" : "opacity-0",
              )}
            >
              <ProductImage
                key={String(active.id)}
                src={active.image_url}
                alt={active.name}
                eager
                className="h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>
      </div>
    </section>
  );
};

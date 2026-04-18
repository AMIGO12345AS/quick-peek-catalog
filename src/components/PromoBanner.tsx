import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductImage } from "./ProductImage";
import type { Product } from "@/lib/catalog";

type Props = {
  product?: Product;
};

export const PromoBanner = ({ product }: Props) => {
  return (
    <section aria-label="Promotion" className="overflow-hidden rounded-2xl bg-gradient-banner shadow-card">
      <div className="grid grid-cols-[1.1fr_1fr] items-stretch">
        <div className="flex flex-col justify-between gap-3 p-5 sm:p-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/70">
              New Collections
            </p>
            <p className="mt-1 text-3xl font-extrabold leading-none tracking-tight text-foreground sm:text-4xl">
              20<span className="align-top text-base font-bold">%</span> OFF
            </p>
          </div>
          {product ? (
            <Link
              to={`/product/${product.id}`}
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
        </div>
        <div className="relative">
          {product ? (
            <ProductImage
              src={product.image_url}
              alt={product.name}
              eager
              className="h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>
      </div>
    </section>
  );
};

import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductImage } from "./ProductImage";
import { formatPrice, type Product } from "@/lib/catalog";

type Props = {
  product?: Product;
};

export const HeroFeature = ({ product }: Props) => {
  if (!product) {
    return (
      <section
        aria-label="Featured"
        className="relative overflow-hidden rounded-[1.75rem] bg-gradient-sand p-6 shadow-card"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
          New season
        </span>
        <h1 className="mt-4 text-3xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-4xl">
          Quiet pieces,
          <br />
          loud presence.
        </h1>
        <a
          href="#all-products"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
        >
          Shop now
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </section>
    );
  }

  return (
    <section aria-label="Featured">
      <Link
        to={`/product/${product.id}`}
        className="group relative block overflow-hidden rounded-[1.75rem] bg-secondary shadow-card md:hidden"
      >
        <ProductImage
          src={product.image_url}
          alt={product.name}
          eager
          className="aspect-[4/5] w-full"
          imgClassName="h-full w-full object-cover transition-transform duration-700 group-active:scale-[1.03]"
        />
        {/* Dark gradient for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/15 to-transparent" />

        {/* Top badge */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            New season
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h1 className="text-3xl font-extrabold leading-[1.05] tracking-tight text-background drop-shadow-sm">
            Quiet pieces,
            <br />
            loud presence.
          </h1>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-bold text-foreground shadow-elevated">
              Shop the look
              <ArrowUpRight className="h-4 w-4" />
            </span>
            <span className="rounded-full bg-background/90 px-3 py-2 text-xs font-bold text-foreground backdrop-blur">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>

      {/* Desktop: editorial split */}
      <div className="hidden overflow-hidden rounded-[2rem] bg-gradient-sand shadow-elevated md:block">
        <div className="grid grid-cols-2">
          <div className="flex flex-col justify-between gap-8 p-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                New season
              </span>
              <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl">
                Quiet pieces,
                <br />
                loud presence.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                A curated drop of essentials — built to layer, made to last.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/product/${product.id}`}
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                Shop the look
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="#all-products"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-background"
              >
                Browse all
              </a>
            </div>
          </div>
          <div className="relative min-h-[480px]">
            <Link to={`/product/${product.id}`} className="block h-full w-full">
              <ProductImage
                src={product.image_url}
                alt={product.name}
                eager
                className="h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

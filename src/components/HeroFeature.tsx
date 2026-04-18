import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductImage } from "./ProductImage";
import { formatPrice, type Product } from "@/lib/catalog";

type Props = {
  product?: Product;
};

export const HeroFeature = ({ product }: Props) => {
  return (
    <section
      aria-label="Featured"
      className="overflow-hidden rounded-[2rem] bg-gradient-sand shadow-elevated"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Copy */}
        <div className="flex flex-col justify-between gap-8 p-8 sm:p-10 md:p-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              New season
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Quiet pieces,
              <br />
              loud presence.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              A curated drop of essentials — built to layer, made to last.
              Discover the pieces shaping the season.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {product ? (
              <Link
                to={`/product/${product.id}`}
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                Shop the look
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background">
                Explore collection
              </span>
            )}
            <a
              href="#all-products"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-background"
            >
              Browse all
            </a>
          </div>
        </div>

        {/* Visual */}
        <div className="relative min-h-[320px] md:min-h-[480px]">
          {product ? (
            <Link to={`/product/${product.id}`} className="block h-full w-full">
              <ProductImage
                src={product.image_url}
                alt={product.name}
                eager
                className="h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                <div className="rounded-2xl bg-background/85 px-4 py-3 shadow-card backdrop-blur">
                  <p className="line-clamp-1 text-sm font-semibold text-foreground">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="h-full w-full bg-gradient-blush" />
          )}
        </div>
      </div>
    </section>
  );
};

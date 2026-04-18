import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductImage } from "./ProductImage";
import { formatPrice, type Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
};

const tones = [
  "bg-gradient-sand",
  "bg-gradient-blush",
];

export const NewInShowcase = ({ title, subtitle, products }: Props) => {
  const picks = products.slice(0, 2);
  if (picks.length === 0) return null;

  return (
    <section aria-label={title}>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <a
          href="#all-products"
          className="hidden items-center gap-1 text-sm font-semibold text-foreground hover:opacity-70 sm:inline-flex"
        >
          View all
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {picks.map((p, i) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className={cn(
              "group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[2rem] p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated sm:p-8",
              tones[i % tones.length],
            )}
          >
            {/* product image fills */}
            <ProductImage
              src={p.image_url}
              alt={p.name}
              className="absolute inset-0 h-full w-full"
              imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            {/* readable overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />

            <div className="relative z-10 flex items-start justify-between">
              <span className="rounded-full bg-background/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground backdrop-blur">
                {p.category || "New"}
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-background text-foreground shadow-card transition-transform group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>

            <div className="relative z-10 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-lg font-bold leading-tight text-background drop-shadow-sm sm:text-xl">
                  {p.name}
                </h3>
              </div>
              <span className="shrink-0 rounded-full bg-background px-4 py-2 text-sm font-extrabold text-foreground shadow-card">
                {formatPrice(p.price)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

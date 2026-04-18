import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductImage } from "./ProductImage";
import { formatPrice, type Product } from "@/lib/catalog";

type Props = {
  title: string;
  subtitle?: string;
  accent?: "deal" | "fresh" | "primary";
  products: Product[];
};

const accentMap: Record<NonNullable<Props["accent"]>, string> = {
  deal: "bg-gradient-deal",
  fresh: "bg-gradient-fresh",
  primary: "bg-gradient-primary",
};

export const DealRow = ({ title, subtitle, accent = "primary", products }: Props) => {
  if (products.length === 0) return null;

  return (
    <section className="rounded-2xl bg-card shadow-card">
      <div className={`flex items-center justify-between rounded-t-2xl px-4 py-3 text-primary-foreground sm:px-5 ${accentMap[accent]}`}>
        <div>
          <h2 className="text-base font-bold tracking-tight sm:text-lg">{title}</h2>
          {subtitle && <p className="text-xs opacity-90 sm:text-sm">{subtitle}</p>}
        </div>
        <span className="hidden text-xs font-medium opacity-90 sm:inline">View all</span>
      </div>

      <div className="-mx-px overflow-x-auto px-3 py-3 sm:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3 sm:gap-4">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group flex w-36 shrink-0 flex-col gap-1.5 rounded-lg border border-border bg-background p-2 transition-shadow hover:shadow-elevated sm:w-44"
            >
              <ProductImage
                src={p.image_url}
                alt={p.name}
                className="aspect-square w-full overflow-hidden rounded-md"
                imgClassName="transition-transform duration-300 group-hover:scale-105"
              />
              <h3 className="line-clamp-2 min-h-[2.5rem] text-xs font-medium text-foreground sm:text-sm">
                {p.name}
              </h3>
              <p className="text-sm font-bold text-foreground">{formatPrice(p.price)}</p>
            </Link>
          ))}
          <div className="flex w-12 shrink-0 items-center justify-center text-muted-foreground">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </section>
  );
};

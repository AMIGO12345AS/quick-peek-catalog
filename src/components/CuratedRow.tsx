import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/catalog";

type Props = {
  title: string;
  products: Product[];
  seeAllHref?: string;
};

export const CuratedRow = ({ title, products, seeAllHref = "#all-products" }: Props) => {
  if (products.length === 0) return null;

  return (
    <section aria-label={title}>
      <div className="mb-3 flex items-end justify-between px-0.5">
        <h2 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
          {title}
        </h2>
        <a
          href={seeAllHref}
          className="text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          See All
        </a>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:-mx-8 sm:px-8">
        <div className="flex gap-3 sm:gap-4">
          {products.map((p) => (
            <div key={p.id} className="w-[48%] max-w-[200px] shrink-0 sm:w-[200px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

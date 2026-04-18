import { ProductImage } from "./ProductImage";
import { cn } from "@/lib/utils";

type Props = {
  categories: string[]; // includes "All" first
  activeCategory: string;
  onCategoryChange: (c: string) => void;
  // map category name → representative product image
  thumbs?: Record<string, string | undefined>;
};

export const CategoryCircles = ({
  categories,
  activeCategory,
  onCategoryChange,
  thumbs = {},
}: Props) => {
  if (categories.length <= 1) return null;

  return (
    <section aria-label="Shop by category">
      <div className="mb-3 flex items-end justify-between px-0.5">
        <h2 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
          Shop By Category
        </h2>
        <a
          href="#all-products"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          See All
        </a>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 py-1 no-scrollbar sm:-mx-8 sm:px-8">
        <div className="flex gap-4">
          {categories.map((c) => {
            const active = c === activeCategory;
            const thumb = thumbs[c];
            return (
              <button
                key={c}
                type="button"
                onClick={() => onCategoryChange(c)}
                className="group flex min-w-[64px] shrink-0 flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    "relative grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-secondary transition-all",
                    active
                      ? "ring-2 ring-foreground"
                      : "ring-1 ring-border",
                  )}
                >
                  {thumb && c !== "All" ? (
                    <ProductImage
                      src={thumb}
                      alt={c}
                      className="h-full w-full"
                      imgClassName="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-base font-extrabold text-foreground">
                      {c.charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "max-w-[72px] truncate text-[11px] font-semibold",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {c}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

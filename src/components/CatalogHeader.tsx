import { Search, ShoppingBag } from "lucide-react";
import { BRAND_NAME } from "@/lib/catalog";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (c: string) => void;
};

export const CatalogHeader = ({
  query,
  onQueryChange,
  categories,
  activeCategory,
  onCategoryChange,
}: Props) => {
  return (
    <header className="sticky top-0 z-30 bg-gradient-hero text-primary-foreground shadow-elevated">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6">
          <a href="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground sm:h-9 sm:w-9">
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="text-base font-bold tracking-tight sm:text-lg">{BRAND_NAME}</span>
          </a>

          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              inputMode="search"
              placeholder="Search for products, brands and more"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="h-10 w-full rounded-lg border border-transparent bg-background pl-10 pr-4 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-accent sm:h-11"
              aria-label="Search products"
            />
          </div>
        </div>

        {categories.length > 1 && (
          <div className="-mx-4 mt-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-2 pb-1">
              {categories.map((c) => {
                const active = c === activeCategory;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onCategoryChange(c)}
                    className={
                      "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all sm:text-sm " +
                      (active
                        ? "bg-accent text-accent-foreground shadow-card"
                        : "bg-primary-foreground/10 text-primary-foreground/90 hover:bg-primary-foreground/20")
                    }
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

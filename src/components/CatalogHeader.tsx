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
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8">
        <div className="flex items-center gap-4 sm:gap-8">
          <a href="/" className="flex shrink-0 items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              {BRAND_NAME.toLowerCase()}
              <span className="text-muted-foreground">.</span>
            </span>
          </a>

          <div className="relative hidden flex-1 sm:block">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              inputMode="search"
              placeholder="Search products"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Search products"
            />
          </div>

          <button
            type="button"
            aria-label="Bag"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary sm:flex"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile search */}
        <div className="relative mt-3 sm:hidden">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            inputMode="search"
            placeholder="Search products"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Search products"
          />
        </div>

        {categories.length > 1 && (
          <nav
            aria-label="Categories"
            className="-mx-4 mt-4 overflow-x-auto px-4 sm:-mx-8 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex gap-2">
              {categories.map((c) => {
                const active = c === activeCategory;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onCategoryChange(c)}
                    className={
                      "shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all sm:text-sm " +
                      (active
                        ? "bg-foreground text-background"
                        : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border")
                    }
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

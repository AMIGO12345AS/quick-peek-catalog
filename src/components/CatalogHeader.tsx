import { Search } from "lucide-react";
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
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 pb-2 pt-3 sm:px-8 sm:pt-4">
        {/* Brand + search inline on mobile */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex shrink-0 items-center">
            <span className="text-lg font-extrabold tracking-tight text-foreground sm:text-2xl">
              {BRAND_NAME.toLowerCase()}
              <span className="text-muted-foreground">.</span>
            </span>
          </a>

          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              inputMode="search"
              placeholder="Search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="h-10 w-full rounded-full border border-border bg-card pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring sm:h-11 sm:pl-11"
              aria-label="Search products"
            />
          </div>
        </div>

        {categories.length > 1 && (
          <nav
            aria-label="Categories"
            className="-mx-4 mt-2.5 overflow-x-auto px-4 sm:-mx-8 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                      "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all sm:px-4 sm:py-2 sm:text-sm " +
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

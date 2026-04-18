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
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{BRAND_NAME}</h1>
        </div>
        <div className="relative mt-3">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            inputMode="search"
            placeholder="Search products"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="h-11 w-full rounded-full border border-input bg-background pl-10 pr-4 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Search products"
          />
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
                      "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm " +
                      (active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-muted-foreground hover:text-foreground")
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

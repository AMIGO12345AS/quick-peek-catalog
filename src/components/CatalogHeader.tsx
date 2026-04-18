import { Search } from "lucide-react";
import { BRAND_NAME } from "@/lib/catalog";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
};

export const CatalogHeader = ({ query, onQueryChange }: Props) => {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center gap-6">
          <a href="/" className="flex shrink-0 items-baseline gap-2">
            <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {BRAND_NAME}
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
              Est.
            </span>
          </a>

          <div className="relative hidden flex-1 sm:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              inputMode="search"
              placeholder="Search the collection"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="h-10 w-full rounded-sm border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-foreground"
              aria-label="Search products"
            />
          </div>
        </div>

        {/* Mobile search */}
        <div className="relative pb-3 sm:hidden">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            inputMode="search"
            placeholder="Search the collection"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="h-10 w-full rounded-sm border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-foreground"
            aria-label="Search products"
          />
        </div>
      </div>
    </header>
  );
};

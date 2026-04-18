import { cn } from "@/lib/utils";

type Props = {
  categories: string[]; // includes "All" first
  activeCategory: string;
  onCategoryChange: (c: string) => void;
};

/**
 * Quiet outlined chip row. No colored circles, no icons —
 * categories are spoken for by the typography.
 */
export const CategoryStrip = ({
  categories,
  activeCategory,
  onCategoryChange,
}: Props) => {
  if (categories.length <= 1) return null;

  return (
    <nav aria-label="Browse categories" className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-6 py-4 sm:gap-8">
            {categories.map((c) => {
              const active = c === activeCategory;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onCategoryChange(c)}
                  className={cn(
                    "shrink-0 whitespace-nowrap text-xs font-medium uppercase tracking-[0.18em] transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "border-b border-transparent pb-1",
                      active && "border-foreground",
                    )}
                  >
                    {c}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

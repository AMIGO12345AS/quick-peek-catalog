import { cn } from "@/lib/utils";

type Props = {
  categories: string[]; // includes "All" first
  activeCategory: string;
  onCategoryChange: (c: string) => void;
};

export const CategoryPills = ({ categories, activeCategory, onCategoryChange }: Props) => {
  if (categories.length <= 1) return null;

  return (
    <section aria-label="Browse categories">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Shop by category
        </h2>
      </div>
      <div className="-mx-4 overflow-x-auto px-4 sm:-mx-8 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2.5">
          {categories.map((c) => {
            const active = c === activeCategory;
            return (
              <button
                key={c}
                type="button"
                onClick={() => onCategoryChange(c)}
                className={cn(
                  "shrink-0 rounded-full px-5 py-3 text-sm font-semibold transition-all",
                  active
                    ? "bg-foreground text-background shadow-card"
                    : "border border-border bg-card text-foreground hover:bg-secondary",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

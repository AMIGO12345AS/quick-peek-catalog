import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  categories: string[]; // includes "All" first
  activeCategory: string;
  onCategoryChange: (c: string) => void;
};

const palette = [
  "bg-gradient-primary",
  "bg-gradient-accent",
  "bg-gradient-fresh",
  "bg-gradient-deal",
  "bg-gradient-hero",
];

export const CategoryCircles = ({ categories, activeCategory, onCategoryChange }: Props) => {
  if (categories.length <= 1) return null;

  return (
    <section aria-label="Browse categories" className="py-1">
      <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-4 pb-2 sm:gap-6">
          {categories.map((c, i) => {
            const active = c === activeCategory;
            const initial = c === "All" ? null : c.charAt(0).toUpperCase();
            return (
              <button
                key={c}
                type="button"
                onClick={() => onCategoryChange(c)}
                className="group flex w-16 shrink-0 flex-col items-center gap-1.5 sm:w-20"
              >
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-card ring-offset-background transition-all group-hover:scale-105 sm:h-16 sm:w-16",
                    palette[i % palette.length],
                    active && "ring-2 ring-accent ring-offset-2",
                  )}
                >
                  {initial ? (
                    <span className="text-xl font-bold sm:text-2xl">{initial}</span>
                  ) : (
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}
                </div>
                <span
                  className={cn(
                    "line-clamp-1 text-[11px] font-medium sm:text-xs",
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

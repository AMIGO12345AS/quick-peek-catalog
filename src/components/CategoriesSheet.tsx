import { Check } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[]; // includes "All" first
  activeCategory: string;
  onSelect: (c: string) => void;
  thumbs?: Record<string, string | undefined>;
};

export const CategoriesSheet = ({
  open,
  onOpenChange,
  categories,
  activeCategory,
  onSelect,
  thumbs = {},
}: Props) => {
  const handleSelect = (c: string) => {
    onSelect(c);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[80vh] overflow-y-auto rounded-t-3xl border-border bg-background"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="text-base font-extrabold">All Categories</SheetTitle>
        </SheetHeader>
        <ul className="mt-4 grid grid-cols-3 gap-3 pb-4 sm:grid-cols-4">
          {categories.map((c) => {
            const active = c === activeCategory;
            const thumb = thumbs[c];
            return (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => handleSelect(c)}
                  className="flex w-full flex-col items-center gap-2 rounded-2xl bg-card p-3 text-center shadow-card transition-transform active:scale-[0.98]"
                >
                  <span
                    className={cn(
                      "relative grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-secondary",
                      active ? "ring-2 ring-foreground" : "ring-1 ring-border",
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
                    {active && (
                      <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-foreground text-background ring-2 ring-background">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "line-clamp-1 w-full text-[11px] font-semibold",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {c}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </SheetContent>
    </Sheet>
  );
};

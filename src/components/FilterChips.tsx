import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc";
export type PriceRange = "all" | "under-500" | "500-1500" | "1500-5000" | "5000-plus";

type Props = {
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  price: PriceRange;
  onPriceChange: (p: PriceRange) => void;
  category: string;
  onClearCategory: () => void;
  query: string;
  onClearQuery: () => void;
};

const sortLabel: Record<SortKey, string> = {
  featured: "Featured",
  "price-asc": "Price: Low → High",
  "price-desc": "Price: High → Low",
  "name-asc": "Name: A → Z",
};

const priceLabel: Record<PriceRange, string> = {
  all: "Price",
  "under-500": "Under 500",
  "500-1500": "500 – 1,500",
  "1500-5000": "1,500 – 5,000",
  "5000-plus": "5,000+",
};

export const FilterChips = ({
  sort,
  onSortChange,
  price,
  onPriceChange,
  category,
  onClearCategory,
  query,
  onClearQuery,
}: Props) => {
  const activeCount =
    (sort !== "featured" ? 1 : 0) + (price !== "all" ? 1 : 0);

  return (
    <div className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:-mx-8 sm:px-8">
      <div className="flex items-center gap-2">
        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary",
              sort !== "featured" && "border-foreground bg-foreground text-background",
            )}
          >
            <SlidersHorizontal className="h-3 w-3" />
            Sort
            <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(v) => onSortChange(v as SortKey)}
            >
              {(Object.keys(sortLabel) as SortKey[]).map((k) => (
                <DropdownMenuRadioItem key={k} value={k}>
                  {sortLabel[k]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Price */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary",
              price !== "all" && "border-foreground bg-foreground text-background",
            )}
          >
            {priceLabel[price]}
            <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuLabel>Price range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={price}
              onValueChange={(v) => onPriceChange(v as PriceRange)}
            >
              {(Object.keys(priceLabel) as PriceRange[]).map((k) => (
                <DropdownMenuRadioItem key={k} value={k}>
                  {k === "all" ? "All prices" : priceLabel[k]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active category chip */}
        {category && category !== "All" && (
          <button
            type="button"
            onClick={onClearCategory}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background"
          >
            {category}
            <X className="h-3 w-3" />
          </button>
        )}

        {/* Active search chip */}
        {query.trim() && (
          <button
            type="button"
            onClick={onClearQuery}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background"
          >
            "{query.trim()}"
            <X className="h-3 w-3" />
          </button>
        )}

        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => {
              onSortChange("featured");
              onPriceChange("all");
            }}
            className="ml-auto shrink-0 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

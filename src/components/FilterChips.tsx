import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/catalog";

export type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc";
export type PriceBounds = { min: number; max: number };

type Props = {
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  priceRange: [number, number];
  priceBounds: PriceBounds;
  onPriceRangeChange: (range: [number, number]) => void;
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

export const FilterChips = ({
  sort,
  onSortChange,
  priceRange,
  priceBounds,
  onPriceRangeChange,
  category,
  onClearCategory,
  query,
  onClearQuery,
}: Props) => {
  const priceActive =
    priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max;
  const activeCount = (sort !== "featured" ? 1 : 0) + (priceActive ? 1 : 0);

  // Step: nice round number based on bounds spread
  const span = Math.max(1, priceBounds.max - priceBounds.min);
  const step = span > 5000 ? 100 : span > 1000 ? 50 : 10;

  const priceChipLabel = priceActive
    ? `${formatPrice(priceRange[0])} – ${formatPrice(priceRange[1])}`
    : "Price";

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

        {/* Price slider */}
        <Popover>
          <PopoverTrigger
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary",
              priceActive && "border-foreground bg-foreground text-background",
            )}
          >
            {priceChipLabel}
            <ChevronDown className="h-3 w-3" />
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Price range
              </p>
              {priceActive && (
                <button
                  type="button"
                  onClick={() =>
                    onPriceRangeChange([priceBounds.min, priceBounds.max])
                  }
                  className="text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="mb-4 flex items-center justify-between text-sm font-bold tabular-nums text-foreground">
              <span>{formatPrice(priceRange[0])}</span>
              <span className="text-muted-foreground">—</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
            <Slider
              min={priceBounds.min}
              max={priceBounds.max}
              step={step}
              value={[priceRange[0], priceRange[1]]}
              minStepsBetweenThumbs={1}
              onValueChange={(v) => {
                const [a, b] = v as number[];
                onPriceRangeChange([a, b]);
              }}
              className="my-2"
              aria-label="Price range"
            />
            <div className="mt-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <span>{formatPrice(priceBounds.min)}</span>
              <span>{formatPrice(priceBounds.max)}</span>
            </div>
          </PopoverContent>
        </Popover>

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
              onPriceRangeChange([priceBounds.min, priceBounds.max]);
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

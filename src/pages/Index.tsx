import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExpiredLinkError, fetchProducts, whatsappFreshLinkRequest, type Product } from "@/lib/catalog";
import { CatalogHeader } from "@/components/CatalogHeader";
import { PromoBanner } from "@/components/PromoBanner";
import { CategoryCircles } from "@/components/CategoryCircles";
import { CuratedRow } from "@/components/CuratedRow";
import { ProductCard } from "@/components/ProductCard";
import { BottomTabBar } from "@/components/BottomTabBar";
import { FilterChips, type PriceRange, type SortKey } from "@/components/FilterChips";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, MessageCircle, PackageOpen, RotateCw } from "lucide-react";

const useDebounced = <T,>(value: T, delay = 200) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const inPriceRange = (price: number, range: PriceRange) => {
  switch (range) {
    case "under-500": return price < 500;
    case "500-1500": return price >= 500 && price < 1500;
    case "1500-5000": return price >= 1500 && price < 5000;
    case "5000-plus": return price >= 5000;
    case "all":
    default: return true;
  }
};

const Index = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, err) => {
      if (err instanceof ExpiredLinkError) return false;
      return failureCount < 2;
    },
  });

  const isExpired = error instanceof ExpiredLinkError;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("featured");
  const [price, setPrice] = useState<PriceRange>("all");
  const debouncedQuery = useDebounced(query, 150);

  const allProducts = data ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set).sort()];
  }, [allProducts]);

  const categoryThumbs = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    for (const p of allProducts) {
      if (p.category && !map[p.category]) map[p.category] = p.image_url;
    }
    return map;
  }, [allProducts]);

  const filtered: Product[] = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const list = allProducts.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchQ = !q || p.name?.toLowerCase().includes(q);
      const n = Number(p.price);
      const matchPrice = !Number.isFinite(n) ? true : inPriceRange(n, price);
      return matchCat && matchQ && matchPrice;
    });

    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name-asc":
        sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "featured":
      default:
        break;
    }
    return sorted;
  }, [allProducts, debouncedQuery, category, sort, price]);

  const featured = allProducts[0];
  const curated = allProducts.slice(0, 8);

  const isFiltering =
    category !== "All" ||
    debouncedQuery.trim().length > 0 ||
    sort !== "featured" ||
    price !== "all";

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <CatalogHeader query={query} onQueryChange={setQuery} />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-4 sm:space-y-10 sm:px-8 sm:py-8">
        {isLoading ? (
          <>
            <Skeleton className="h-[160px] w-full rounded-2xl" />
            <div
              className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              <span>Loading collection…</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))}
            </div>
          </>
        ) : isError ? (
          isExpired ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-card py-20 text-center shadow-card">
              <p className="text-base font-semibold">This catalog link has expired</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Please message us on WhatsApp to request a fresh catalog link.
              </p>
              <a
                href={whatsappFreshLinkRequest()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                Request fresh link on WhatsApp
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-card py-20 text-center shadow-card">
              <p className="text-base font-semibold">Products currently unavailable</p>
              <p className="text-sm text-muted-foreground">
                We couldn't load the catalog right now. Please try again in a moment.
              </p>
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-60"
              >
                <RotateCw className={"h-4 w-4 " + (isFetching ? "animate-spin" : "")} />
                {isFetching ? "Retrying…" : "Retry"}
              </button>
            </div>
          )
        ) : (
          <>
            {!isFiltering && (
              <>
                <PromoBanner product={featured} />
                <CategoryCircles
                  categories={categories}
                  activeCategory={category}
                  onCategoryChange={setCategory}
                  thumbs={categoryThumbs}
                />
                {curated.length > 0 && (
                  <CuratedRow title="Curated For You" products={curated} />
                )}
              </>
            )}

            <section id="all-products" className="scroll-mt-24 space-y-3">
              <div className="flex items-end justify-between px-0.5">
                <h2 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
                  {isFiltering ? "Results" : "Shop All"}
                </h2>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {filtered.length} {filtered.length === 1 ? "item" : "items"}
                </span>
              </div>

              <FilterChips
                sort={sort}
                onSortChange={setSort}
                price={price}
                onPriceChange={setPrice}
                category={category}
                onClearCategory={() => setCategory("All")}
                query={query}
                onClearQuery={() => setQuery("")}
              />

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-card py-16 text-center shadow-card">
                  <PackageOpen className="h-8 w-8 text-muted-foreground" aria-hidden />
                  <p className="text-base font-semibold">No products found</p>
                  <p className="text-sm text-muted-foreground">
                    Try a different search, category, or price range.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <BottomTabBar />
    </div>
  );
};

export default Index;

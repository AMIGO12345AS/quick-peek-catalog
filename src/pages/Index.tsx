import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExpiredLinkError, fetchProducts, whatsappFreshLinkRequest, type Product } from "@/lib/catalog";
import { CatalogHeader } from "@/components/CatalogHeader";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryCircles } from "@/components/CategoryCircles";
import { DealRow } from "@/components/DealRow";
import { ProductCard } from "@/components/ProductCard";
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
  const debouncedQuery = useDebounced(query, 150);

  const categories = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set).sort()];
  }, [data]);

  const filtered: Product[] = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return (data ?? []).filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchQ = !q || p.name?.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [data, debouncedQuery, category]);

  // Curated deal rows from the cached product list (no fake data — just slices)
  const allProducts = data ?? [];
  const topDeals = allProducts.slice(0, 10);
  const newArrivals = allProducts.slice(-10).reverse();
  const trending = useMemo(() => {
    // deterministic shuffle by id hash so it's stable per session
    const arr = [...allProducts];
    arr.sort((a, b) => String(a.id).localeCompare(String(b.id)));
    return arr.slice(0, 10);
  }, [allProducts]);

  const isFiltering = category !== "All" || debouncedQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-secondary/40">
      <CatalogHeader
        query={query}
        onQueryChange={setQuery}
        categories={categories}
        activeCategory={category}
        onCategoryChange={setCategory}
      />

      <main className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-6 sm:py-6">
        {isLoading ? (
          <>
            <Skeleton className="h-44 w-full rounded-2xl sm:h-64 md:h-80" />
            <div
              className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              <span>Loading products…</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
                  <Skeleton className="aspect-square w-full rounded-none" />
                  <div className="space-y-2 p-3 sm:p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : isError ? (
          isExpired ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-card py-20 text-center shadow-card">
              <p className="text-base font-medium">This catalog link has expired</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Please message us on WhatsApp to request a fresh catalog link.
              </p>
              <a
                href={whatsappFreshLinkRequest()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-card hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                Request fresh link on WhatsApp
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-card py-20 text-center shadow-card">
              <p className="text-base font-medium">Products currently unavailable</p>
              <p className="text-sm text-muted-foreground">
                We couldn't load the catalog right now. Please try again in a moment.
              </p>
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card hover:opacity-90 disabled:opacity-60"
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
                <HeroCarousel />
                <CategoryCircles
                  categories={categories}
                  activeCategory={category}
                  onCategoryChange={setCategory}
                />
                <DealRow
                  title="Top Deals"
                  subtitle="Handpicked offers you'll love"
                  accent="deal"
                  products={topDeals}
                />
                <DealRow
                  title="New Arrivals"
                  subtitle="Fresh on the shelves"
                  accent="fresh"
                  products={newArrivals}
                />
                <DealRow
                  title="Trending Now"
                  subtitle="What everyone's eyeing"
                  accent="primary"
                  products={trending}
                />
              </>
            )}

            <section>
              <div className="mb-3 flex items-end justify-between">
                <h2 className="text-lg font-bold tracking-tight sm:text-xl">
                  {isFiltering ? "Results" : "All Products"}
                </h2>
                <span className="text-xs text-muted-foreground sm:text-sm">
                  {filtered.length} {filtered.length === 1 ? "item" : "items"}
                </span>
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-card py-20 text-center shadow-card">
                  <PackageOpen className="h-8 w-8 text-muted-foreground" aria-hidden />
                  <p className="text-base font-medium">No products found</p>
                  <p className="text-sm text-muted-foreground">
                    Try a different search or category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-border bg-card py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} · All prices in your local currency</p>
      </footer>
    </div>
  );
};

export default Index;

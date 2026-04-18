import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExpiredLinkError, fetchProducts, whatsappFreshLinkRequest, type Product } from "@/lib/catalog";
import { CatalogHeader } from "@/components/CatalogHeader";
import { HeroFeature } from "@/components/HeroFeature";
import { CategoryPills } from "@/components/CategoryPills";
import { NewInShowcase } from "@/components/NewInShowcase";
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

  const allProducts = data ?? [];
  const featured = allProducts[0];
  const newIn = allProducts.slice(0, 2);

  const isFiltering = category !== "All" || debouncedQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader
        query={query}
        onQueryChange={setQuery}
        categories={categories}
        activeCategory={category}
        onCategoryChange={setCategory}
      />

      <main className="mx-auto max-w-7xl space-y-12 px-4 py-6 sm:px-8 sm:py-10">
        {isLoading ? (
          <>
            <Skeleton className="h-[420px] w-full rounded-[2rem]" />
            <div
              className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              <span>Loading collection…</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/5] w-full rounded-[1.5rem]" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          </>
        ) : isError ? (
          isExpired ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-[2rem] bg-card py-24 text-center shadow-card">
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
            <div className="flex flex-col items-center justify-center gap-3 rounded-[2rem] bg-card py-24 text-center shadow-card">
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
                <HeroFeature product={featured} />
                <CategoryPills
                  categories={categories}
                  activeCategory={category}
                  onCategoryChange={setCategory}
                />
                <NewInShowcase
                  title="New in"
                  subtitle="Just landed — handpicked for the season."
                  products={newIn}
                />
              </>
            )}

            <section id="all-products" className="scroll-mt-24">
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {isFiltering ? "Results" : "The collection"}
                  </h2>
                  {!isFiltering && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Every piece, in one place.
                    </p>
                  )}
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {filtered.length} {filtered.length === 1 ? "item" : "items"}
                </span>
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-[2rem] bg-card py-24 text-center shadow-card">
                  <PackageOpen className="h-8 w-8 text-muted-foreground" aria-hidden />
                  <p className="text-base font-semibold">No products found</p>
                  <p className="text-sm text-muted-foreground">
                    Try a different search or category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="mt-16 border-t border-border bg-background py-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          © {new Date().getFullYear()} · Crafted with care
        </p>
      </footer>
    </div>
  );
};

export default Index;

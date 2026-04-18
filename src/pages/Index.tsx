import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type Product } from "@/lib/catalog";
import { CatalogHeader } from "@/components/CatalogHeader";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageOpen, RotateCw } from "lucide-react";

const useDebounced = <T,>(value: T, delay = 200) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const Index = () => {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

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

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader
        query={query}
        onQueryChange={setQuery}
        categories={categories}
        activeCategory={category}
        onCategoryChange={setCategory}
      />

      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-border">
                <Skeleton className="aspect-square w-full rounded-none" />
                <div className="space-y-2 p-3 sm:p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <p className="text-base font-medium">We couldn't load the catalog.</p>
            <p className="text-sm text-muted-foreground">Check your connection and try again.</p>
            <button
              onClick={() => refetch()}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              <RotateCw className={"h-4 w-4 " + (isFetching ? "animate-spin" : "")} />
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
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
      </main>
    </div>
  );
};

export default Index;

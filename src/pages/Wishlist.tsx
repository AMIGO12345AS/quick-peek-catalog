import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Loader2, Trash2 } from "lucide-react";
import { ExpiredLinkError, fetchProducts, whatsappFreshLinkRequest } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { BottomTabBar } from "@/components/BottomTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlist } from "@/hooks/useWishlist";

const Wishlist = () => {
  const { ids, clear, count } = useWishlist();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, err) => {
      if (err instanceof ExpiredLinkError) return false;
      return failureCount < 2;
    },
    enabled: ids.length > 0,
  });

  const isExpired = error instanceof ExpiredLinkError;
  const products = (data ?? []).filter((p) => ids.includes(String(p.id)));

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-8 sm:py-4">
          <Link
            to="/"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
            Wishlist {count > 0 && <span className="text-muted-foreground">({count})</span>}
          </h1>
          {count > 0 ? (
            <button
              type="button"
              onClick={() => {
                if (confirm("Clear all items from your wishlist?")) clear();
              }}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Clear wishlist"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : (
            <span className="h-10 w-10" aria-hidden />
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-4 sm:px-8 sm:py-8">
        {ids.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-card py-20 text-center shadow-card">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-secondary">
              <Heart className="h-6 w-6 text-muted-foreground" />
            </span>
            <p className="text-base font-semibold">Your wishlist is empty</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Tap the heart on any product to save it here for later.
            </p>
            <Link
              to="/"
              className="mt-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90"
            >
              Browse products
            </Link>
          </div>
        ) : isLoading ? (
          <>
            <div
              className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              <span>Loading your saved items…</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: Math.min(ids.length, 4) }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))}
            </div>
          </>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-card py-20 text-center shadow-card">
            <p className="text-base font-semibold">
              {isExpired ? "This catalog link has expired" : "Couldn't load your wishlist"}
            </p>
            {isExpired && (
              <a
                href={whatsappFreshLinkRequest()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90"
              >
                Request fresh link on WhatsApp
              </a>
            )}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-card py-20 text-center shadow-card">
            <p className="text-base font-semibold">Saved items unavailable</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              The products you saved aren't in the current catalog anymore.
            </p>
            <button
              type="button"
              onClick={clear}
              className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90"
            >
              Clear wishlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      <BottomTabBar />
    </div>
  );
};

export default Wishlist;

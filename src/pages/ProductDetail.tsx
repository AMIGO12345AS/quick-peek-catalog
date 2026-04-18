import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import {
  ExpiredLinkError,
  fetchProducts,
  formatPrice,
  whatsappFreshLinkRequest,
  whatsappLink,
} from "@/lib/catalog";
import { ProductImage } from "@/components/ProductImage";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, err) => {
      if (err instanceof ExpiredLinkError) return false;
      return failureCount < 2;
    },
  });

  const isExpired = error instanceof ExpiredLinkError;

  const product = data?.find((p) => String(p.id) === String(id));

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="min-h-screen bg-secondary/40 pb-24">
      <header className="sticky top-0 z-30 bg-gradient-hero text-primary-foreground shadow-elevated">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3 sm:px-6">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <span className="ml-1 text-sm font-semibold opacity-90">Product Details</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
        {isLoading ? (
          <div className="space-y-4 rounded-2xl bg-card p-4 shadow-card">
            <div
              className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              <span>Loading product…</span>
            </div>
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : isExpired ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-card py-20 text-center shadow-card">
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
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-card py-20 text-center shadow-card">
            <p className="text-base font-medium">Products currently unavailable</p>
            <p className="text-sm text-muted-foreground">
              Please try again in a moment.
            </p>
            <Link
              to="/"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card hover:opacity-90"
            >
              Back to catalog
            </Link>
          </div>
        ) : !product ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-card py-20 text-center shadow-card">
            <p className="text-base font-medium">Product not found.</p>
            <Link
              to="/"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card hover:opacity-90"
            >
              Back to catalog
            </Link>
          </div>
        ) : (
          <article className="overflow-hidden rounded-2xl bg-card shadow-card">
            <ProductImage
              src={product.image_url}
              alt={product.name}
              eager
              className="aspect-square w-full"
            />
            <div className="space-y-3 p-5 sm:p-6">
              {product.category && (
                <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {product.category}
                </span>
              )}
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {product.name}
              </h1>
              <p className="text-2xl font-extrabold text-primary sm:text-3xl">
                {formatPrice(product.price)}
              </p>
              {product.description && (
                <p className="whitespace-pre-line pt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {product.description}
                </p>
              )}
            </div>
          </article>
        )}
      </main>

      {product && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
          <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
            <a
              href={whatsappLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-accent text-sm font-bold text-accent-foreground shadow-elevated transition-transform hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-base"
            >
              <MessageCircle className="h-5 w-5" />
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

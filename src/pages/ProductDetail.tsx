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
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-4 sm:px-8">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Product
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Skeleton className="aspect-[4/5] w-full rounded-[2rem]" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div
              className="col-span-full flex items-center justify-center gap-2 text-sm text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              <span>Loading product…</span>
            </div>
          </div>
        ) : isExpired ? (
          <div className="flex flex-col items-center gap-3 rounded-[2rem] bg-card py-24 text-center shadow-card">
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
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 rounded-[2rem] bg-card py-24 text-center shadow-card">
            <p className="text-base font-semibold">Products currently unavailable</p>
            <p className="text-sm text-muted-foreground">Please try again in a moment.</p>
            <Link
              to="/"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90"
            >
              Back to catalog
            </Link>
          </div>
        ) : !product ? (
          <div className="flex flex-col items-center gap-3 rounded-[2rem] bg-card py-24 text-center shadow-card">
            <p className="text-base font-semibold">Product not found.</p>
            <Link
              to="/"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90"
            >
              Back to catalog
            </Link>
          </div>
        ) : (
          <article className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <div className="overflow-hidden rounded-[2rem] bg-secondary shadow-card">
              <ProductImage
                src={product.image_url}
                alt={product.name}
                eager
                className="aspect-[4/5] w-full"
              />
            </div>

            <div className="flex flex-col gap-6 md:py-4">
              {product.category && (
                <span className="inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {product.category}
                </span>
              )}
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {product.name}
              </h1>
              <p className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {formatPrice(product.price)}
              </p>

              {product.description && (
                <div className="border-t border-border pt-6">
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Details
                  </h2>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85 sm:text-base">
                    {product.description}
                  </p>
                </div>
              )}

              <a
                href={whatsappLink(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden h-14 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-bold text-background shadow-elevated transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:inline-flex md:text-base"
              >
                <MessageCircle className="h-5 w-5" />
                Enquire on WhatsApp
              </a>
            </div>
          </article>
        )}
      </main>

      {product && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-8">
            <a
              href={whatsappLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-foreground py-4 text-sm font-bold text-background shadow-elevated transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

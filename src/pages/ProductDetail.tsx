import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, Heart, Loader2, MessageCircle, ShoppingBag, Star } from "lucide-react";
import { useMemo, useState } from "react";
import {
  ExpiredLinkError,
  fetchProducts,
  formatPrice,
  whatsappFreshLinkRequest,
  whatsappLink,
} from "@/lib/catalog";
import { ProductImage } from "@/components/ProductImage";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { has, toggle } = useWishlist();
  const { has: inCart, add } = useCart();
  const liked = id ? has(id) : false;
  const [activeImage, setActiveImage] = useState(0);

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

  const images = useMemo(() => {
    if (!product) return [] as string[];
    if (product.images && product.images.length > 0) return product.images;
    return [product.image_url];
  }, [product]);

  const hasSale =
    product?.original_price !== undefined &&
    Number(product.original_price) > Number(product.price);

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-8 sm:py-4">
          <button
            onClick={goBack}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
            Detail Product
          </h1>
          <button
            type="button"
            onClick={() => id && toggle(id)}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Heart className={cn("h-4 w-4", liked && "fill-sale text-sale")} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-4 sm:px-8 sm:py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-5 w-1/3" />
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
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-card py-20 text-center shadow-card">
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
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-card py-20 text-center shadow-card">
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
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-card py-20 text-center shadow-card">
            <p className="text-base font-semibold">Product not found.</p>
            <Link
              to="/"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90"
            >
              Back to catalog
            </Link>
          </div>
        ) : (
          <article className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
            {/* Image area — centered, white bg with dot indicators */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-secondary p-6 sm:p-10">
                <ProductImage
                  src={images[activeImage] ?? product.image_url}
                  alt={product.name}
                  eager
                  className="h-full w-full"
                  imgClassName="h-full w-full object-contain"
                />
              </div>
              {images.length > 1 && (
                <div className="flex items-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to image ${i + 1}`}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i === activeImage
                          ? "w-5 bg-foreground"
                          : "w-1.5 bg-border",
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 md:py-2">
              {(product.brand || product.rating) && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {product.brand && (
                    <span className="font-bold text-foreground">{product.brand}</span>
                  )}
                  {product.rating !== undefined && (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="font-semibold text-foreground">
                        {product.rating.toFixed(1)}
                      </span>
                      {product.reviews !== undefined && (
                        <span>({product.reviews})</span>
                      )}
                    </span>
                  )}
                </div>
              )}

              <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-2">
                <p
                  className={cn(
                    "text-2xl font-extrabold tracking-tight sm:text-3xl",
                    hasSale ? "text-sale" : "text-foreground",
                  )}
                >
                  {formatPrice(product.price)}
                </p>
                {hasSale && (
                  <p className="text-sm font-medium text-muted-foreground line-through">
                    {formatPrice(product.original_price!)}
                  </p>
                )}
              </div>

              {product.category && (
                <span className="inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {product.category}
                </span>
              )}

              {product.description && (
                <div className="border-t border-border pt-5">
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Details
                  </h3>
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
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
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

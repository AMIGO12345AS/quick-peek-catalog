import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { fetchProducts, formatPrice, whatsappLink } from "@/lib/catalog";
import { ProductImage } from "@/components/ProductImage";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  const product = data?.find((p) => String(p.id) === String(id));

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3 sm:px-6">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : isError || !product ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="text-base font-medium">Product not found.</p>
            <Link
              to="/"
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Back to catalog
            </Link>
          </div>
        ) : (
          <article className="space-y-5">
            <ProductImage
              src={product.image_url}
              alt={product.name}
              eager
              className="aspect-square w-full rounded-lg border border-border"
            />
            <div className="space-y-2">
              {product.category && (
                <span className="inline-block rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {product.category}
                </span>
              )}
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {product.name}
              </h1>
              <p className="text-xl font-semibold sm:text-2xl">
                {formatPrice(product.price)}
              </p>
            </div>
            {product.description && (
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
                {product.description}
              </p>
            )}
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
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-semibold text-background hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MessageCircle className="h-4 w-4" />
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

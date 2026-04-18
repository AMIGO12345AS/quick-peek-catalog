import { Check, Heart, Plus, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ProductImage } from "./ProductImage";
import { formatPrice, getPricing, parsePrice, type Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";

export const ProductCard = ({ product }: { product: Product }) => {
  const { has, toggle } = useWishlist();
  const { has: inCart, add, remove } = useCart();
  const liked = has(product.id);
  const added = inCart(product.id);
  const pricing = getPricing(product);
  const hasSale = pricing.hasDeal;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col gap-2 focus:outline-none"
    >
      <div className="relative overflow-hidden rounded-2xl bg-secondary">
        <ProductImage
          src={product.image_url}
          alt={product.name}
          className="aspect-[4/5] w-full"
          imgClassName="transition-transform duration-500 group-hover:scale-[1.04] group-active:scale-[1.02]"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const wasLiked = liked;
            toggle(product.id);
            if (wasLiked) toast(`Removed from wishlist`, { description: product.name });
            else toast.success(`Added to wishlist`, { description: product.name });
          }}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={liked}
          className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-background/95 shadow-soft backdrop-blur transition-transform active:scale-95"
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              liked ? "fill-sale text-sale" : "text-foreground",
            )}
          />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (added) {
              remove(product.id);
              toast(`Removed from cart`, { description: product.name });
            } else {
              add(
                {
                  id: String(product.id),
                  name: product.name,
                  price: parsePrice(product.price),
                  image_url: product.image_url,
                },
                1,
              );
              toast.success(`Added to cart`, { description: product.name });
            }
          }}
          aria-label={added ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
          className={cn(
            "absolute bottom-2.5 right-2.5 grid h-9 w-9 place-items-center rounded-full shadow-elevated transition-transform active:scale-95",
            added
              ? "bg-sale text-sale-foreground"
              : "bg-foreground text-background",
          )}
        >
          {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex flex-col gap-0.5 px-0.5">
        {(product.brand || product.rating) && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            {product.brand && (
              <span className="font-semibold text-foreground">{product.brand}</span>
            )}
            {product.rating !== undefined && (
              <span className="inline-flex items-center gap-0.5">
                <Star className="h-2.5 w-2.5 fill-warning text-warning" />
                <span className="font-medium">{product.rating.toFixed(1)}</span>
                {product.reviews !== undefined && (
                  <span className="text-muted-foreground">({product.reviews})</span>
                )}
              </span>
            )}
          </div>
        )}
        <h3 className="line-clamp-1 text-[13px] font-semibold leading-snug text-foreground sm:text-sm">
          {product.name}
        </h3>
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <p className={cn("text-sm font-extrabold", hasSale ? "text-sale" : "text-foreground")}>
            {formatPrice(pricing.display)}
          </p>
          {hasSale && pricing.original !== null && (
            <>
              <p className="text-[11px] font-medium text-muted-foreground line-through">
                {formatPrice(pricing.original)}
              </p>
              <span className="rounded-full bg-sale/10 px-1.5 py-0.5 text-[9px] font-bold leading-none text-sale">
                {pricing.discountPct}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

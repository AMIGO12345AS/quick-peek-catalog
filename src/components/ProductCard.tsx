import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ProductImage } from "./ProductImage";
import { formatPrice, type Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const ProductCard = ({ product }: { product: Product }) => {
  const [liked, setLiked] = useState(false);
  const hasSale =
    product.original_price !== undefined &&
    Number(product.original_price) > Number(product.price);

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
            setLiked((v) => !v);
          }}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-background/95 shadow-soft backdrop-blur transition-transform active:scale-95"
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              liked ? "fill-sale text-sale" : "text-foreground",
            )}
          />
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
        <div className="flex items-baseline gap-1.5">
          <p className={cn("text-sm font-extrabold", hasSale ? "text-sale" : "text-foreground")}>
            {formatPrice(product.price)}
          </p>
          {hasSale && (
            <p className="text-[11px] font-medium text-muted-foreground line-through">
              {formatPrice(product.original_price!)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

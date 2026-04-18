import { Link } from "react-router-dom";
import { ProductImage } from "./ProductImage";
import { formatPrice, type Product } from "@/lib/catalog";

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ProductImage
        src={product.image_url}
        alt={product.name}
        className="aspect-square w-full"
        imgClassName="transition-transform duration-300 group-hover:scale-[1.04]"
      />
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-foreground sm:text-base">
          {product.name}
        </h3>
        <p className="text-base font-bold text-foreground sm:text-lg">
          {formatPrice(product.price)}
        </p>
        {product.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
            {product.description}
          </p>
        )}
      </div>
    </Link>
  );
};

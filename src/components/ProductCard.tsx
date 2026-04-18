import { Link } from "react-router-dom";
import { ProductImage } from "./ProductImage";
import { formatPrice, type Product } from "@/lib/catalog";

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ProductImage
        src={product.image_url}
        alt={product.name}
        className="aspect-[4/5] w-full overflow-hidden rounded-sm bg-secondary"
        imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="space-y-1">
        {product.category && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {product.category}
          </p>
        )}
        <h3 className="line-clamp-1 text-sm font-medium text-foreground sm:text-base">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground sm:text-base">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
};

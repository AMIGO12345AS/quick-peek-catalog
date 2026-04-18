import { Link } from "react-router-dom";
import { ProductImage } from "./ProductImage";
import { formatPrice, type Product } from "@/lib/catalog";

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col gap-3 focus:outline-none"
    >
      <div className="relative overflow-hidden rounded-[1.5rem] bg-secondary">
        <ProductImage
          src={product.image_url}
          alt={product.name}
          className="aspect-[4/5] w-full"
          imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground backdrop-blur">
            {product.category}
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-3 px-1">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-[15px]">
          {product.name}
        </h3>
        <p className="shrink-0 text-sm font-extrabold text-foreground sm:text-[15px]">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
};

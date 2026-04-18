import { Link } from "react-router-dom";
import { ProductImage } from "./ProductImage";
import { formatPrice, type Product } from "@/lib/catalog";

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
};

/**
 * Editorial section: small label, large serif title, hairline rule,
 * horizontally scrolling product cards. No coloured headers, no badges.
 */
export const DealRow = ({ title, subtitle, products }: Props) => {
  if (products.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          {subtitle && (
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {subtitle}
            </p>
          )}
          <h2 className="font-display mt-1 text-2xl tracking-tight text-foreground sm:text-3xl">
            {title}
          </h2>
        </div>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-5 sm:gap-7">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group flex w-44 shrink-0 flex-col gap-3 sm:w-52"
            >
              <ProductImage
                src={p.image_url}
                alt={p.name}
                className="aspect-[4/5] w-full overflow-hidden rounded-sm bg-secondary"
                imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="space-y-1">
                <h3 className="line-clamp-1 text-sm font-medium text-foreground">
                  {p.name}
                </h3>
                <p className="text-sm text-muted-foreground">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

import { Search, Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { BRAND_NAME } from "@/lib/catalog";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
};

export const CatalogHeader = ({ query, onQueryChange }: Props) => {
  const { count: wishCount } = useWishlist();
  const { count: cartCount } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 pb-3 pt-3 sm:px-8 sm:pt-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex shrink-0 items-center" aria-label="Home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background sm:h-10 sm:w-10">
              <span className="text-base font-extrabold sm:text-lg">
                {BRAND_NAME.charAt(0).toUpperCase()}
              </span>
            </span>
          </Link>

          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              inputMode="search"
              placeholder="Search for products"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="h-10 w-full rounded-full border border-border bg-secondary pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring sm:h-11 sm:pl-11"
              aria-label="Search products"
            />
          </div>

          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary sm:h-11 sm:w-11"
          >
            <Heart className="h-4 w-4" />
            {wishCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-sale px-1 text-[9px] font-bold text-sale-foreground">
                {wishCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            aria-label="Cart"
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary sm:h-11 sm:w-11"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-sale px-1 text-[9px] font-bold text-sale-foreground">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

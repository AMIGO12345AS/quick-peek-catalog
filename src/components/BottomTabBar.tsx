import { NavLink } from "react-router-dom";
import { Home, Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";

export const BottomTabBar = () => {
  const { count: wishCount } = useWishlist();
  const { count: cartCount } = useCart();

  const items = [
    { to: "/", label: "Home", Icon: Home, end: true, badge: 0 },
    { to: "/wishlist", label: "Wishlist", Icon: Heart, end: false, badge: wishCount },
    { to: "/cart", label: "Cart", Icon: ShoppingBag, end: false, badge: cartCount },
  ];

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 shadow-nav backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
        {items.map(({ to, label, Icon, end, badge }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "relative flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[11px] font-semibold transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        isActive && to === "/wishlist" && "fill-sale text-sale",
                      )}
                      strokeWidth={isActive ? 2.4 : 1.8}
                    />
                    {badge > 0 && (
                      <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-sale px-1 text-[9px] font-bold text-sale-foreground">
                        {badge}
                      </span>
                    )}
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

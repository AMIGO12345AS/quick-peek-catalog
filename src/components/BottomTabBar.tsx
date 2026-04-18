import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, LayoutGrid, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { fetchProducts, parsePrice } from "@/lib/catalog";
import { CategoriesSheet } from "./CategoriesSheet";

export const BottomTabBar = () => {
  const { count: cartCount } = useCart();
  const [catOpen, setCatOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Reuse cached products query (Index already populates this)
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });
  const allProducts = data ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set).sort()];
  }, [allProducts]);

  const thumbs = useMemo(() => {
    const best: Record<string, { price: number; image: string }> = {};
    for (const p of allProducts) {
      if (!p.category || !p.image_url) continue;
      const price = Math.max(
        parsePrice(p.original_price ?? p.price),
        parsePrice(p.price),
      );
      const current = best[p.category];
      if (!current || price > current.price) {
        best[p.category] = { price, image: p.image_url };
      }
    }
    const map: Record<string, string | undefined> = {};
    for (const k of Object.keys(best)) map[k] = best[k].image;
    return map;
  }, [allProducts]);

  const activeCategory = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "All";
  }, [location.search]);

  const handleSelectCategory = (c: string) => {
    const params = new URLSearchParams(location.search);
    if (c === "All") params.delete("category");
    else params.set("category", c);
    const qs = params.toString();
    navigate({ pathname: "/", search: qs ? `?${qs}` : "" });
  };

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 shadow-nav backdrop-blur-md md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
          <li className="flex-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  "relative flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[11px] font-semibold transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Home className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} />
                  <span>Home</span>
                </>
              )}
            </NavLink>
          </li>

          <li className="flex-1">
            <button
              type="button"
              onClick={() => setCatOpen(true)}
              disabled={categories.length <= 1}
              className={cn(
                "relative flex w-full flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-50",
                catOpen || activeCategory !== "All"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
              aria-label="Categories"
              aria-haspopup="dialog"
              aria-expanded={catOpen}
            >
              <LayoutGrid
                className="h-5 w-5"
                strokeWidth={catOpen || activeCategory !== "All" ? 2.4 : 1.8}
              />
              <span>Categories</span>
            </button>
          </li>

          <li className="flex-1">
            <NavLink
              to="/cart"
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
                    <ShoppingBag className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} />
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-sale px-1 text-[9px] font-bold text-sale-foreground">
                        {cartCount}
                      </span>
                    )}
                  </span>
                  <span>Cart</span>
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>

      <CategoriesSheet
        open={catOpen}
        onOpenChange={setCatOpen}
        categories={categories}
        activeCategory={activeCategory}
        onSelect={handleSelectCategory}
        thumbs={thumbs}
      />
    </>
  );
};

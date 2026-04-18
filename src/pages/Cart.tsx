import { Link } from "react-router-dom";
import { ArrowLeft, Minus, MessageCircle, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { ProductImage } from "@/components/ProductImage";
import { BottomTabBar } from "@/components/BottomTabBar";
import { formatPrice, whatsappOrderLink } from "@/lib/catalog";

const Cart = () => {
  const { items, increment, decrement, remove, clear, count, subtotal } = useCart();

  const orderHref = whatsappOrderLink(
    items.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
  );

  return (
    <div className="min-h-screen bg-background pb-40 md:pb-24">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3 sm:px-8 sm:py-4">
          <Link
            to="/"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Back to catalog"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
            My Cart {count > 0 && <span className="text-muted-foreground">({count})</span>}
          </h1>
          {items.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          ) : (
            <span className="w-10" aria-hidden />
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-4 sm:px-8 sm:py-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-card py-20 text-center shadow-card">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" aria-hidden />
            <p className="text-base font-semibold">Your cart is empty</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Browse the catalog and tap “Add to Cart” to start an order.
            </p>
            <Link
              to="/"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex gap-3 rounded-2xl bg-card p-3 shadow-card"
              >
                <Link
                  to={`/product/${item.id}`}
                  className="block h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary"
                >
                  <ProductImage
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full"
                    imgClassName="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/product/${item.id}`}
                      className="line-clamp-2 text-sm font-semibold leading-snug text-foreground"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-extrabold text-foreground">
                      {formatPrice(item.price * item.qty)}
                    </p>
                    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background p-0.5">
                      <button
                        type="button"
                        onClick={() => decrement(item.id)}
                        aria-label="Decrease quantity"
                        className="grid h-7 w-7 place-items-center rounded-full text-foreground hover:bg-secondary"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-6 text-center text-xs font-bold tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => increment(item.id)}
                        aria-label="Increase quantity"
                        className="grid h-7 w-7 place-items-center rounded-full text-foreground hover:bg-secondary"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {items.length > 0 && (
        <div
          className="fixed inset-x-0 bottom-14 z-30 border-t border-border bg-background/95 backdrop-blur-md md:bottom-0"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3 sm:px-8">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-muted-foreground">Subtotal</span>
              <span className="text-base font-extrabold text-foreground">
                {formatPrice(subtotal)}
              </span>
            </div>
            <a
              href={orderHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-bold text-background shadow-elevated transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MessageCircle className="h-5 w-5" />
              Send order on WhatsApp
            </a>
          </div>
        </div>
      )}

      <BottomTabBar />
    </div>
  );
};

export default Cart;

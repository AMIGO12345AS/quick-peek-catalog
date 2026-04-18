import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cart:v1";
const EVENT = "cart:change";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  qty: number;
};

const read = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x) => x && typeof x === "object")
      .map((x: Record<string, unknown>) => ({
        id: String(x.id ?? ""),
        name: String(x.name ?? ""),
        price: Number(x.price ?? 0),
        image_url: String(x.image_url ?? ""),
        qty: Math.max(1, Number(x.qty ?? 1) || 1),
      }))
      .filter((x) => x.id);
  } catch {
    return [];
  }
};

const write = (items: CartItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
};

const emit = () => window.dispatchEvent(new Event(EVENT));

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(() => read());

  useEffect(() => {
    const sync = () => setItems(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const has = useCallback(
    (id: string | number) => items.some((x) => x.id === String(id)),
    [items],
  );

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    const current = read();
    const sid = String(item.id);
    const existing = current.find((x) => x.id === sid);
    let next: CartItem[];
    if (existing) {
      next = current.map((x) =>
        x.id === sid ? { ...x, qty: x.qty + qty } : x,
      );
    } else {
      next = [
        ...current,
        {
          id: sid,
          name: item.name,
          price: Number(item.price) || 0,
          image_url: item.image_url,
          qty,
        },
      ];
    }
    write(next);
    setItems(next);
    emit();
  }, []);

  const setQty = useCallback((id: string | number, qty: number) => {
    const sid = String(id);
    const next = read()
      .map((x) => (x.id === sid ? { ...x, qty: Math.max(1, qty) } : x))
      .filter((x) => x.qty > 0);
    write(next);
    setItems(next);
    emit();
  }, []);

  const increment = useCallback((id: string | number) => {
    const sid = String(id);
    const next = read().map((x) => (x.id === sid ? { ...x, qty: x.qty + 1 } : x));
    write(next);
    setItems(next);
    emit();
  }, []);

  const decrement = useCallback((id: string | number) => {
    const sid = String(id);
    const next = read()
      .map((x) => (x.id === sid ? { ...x, qty: x.qty - 1 } : x))
      .filter((x) => x.qty > 0);
    write(next);
    setItems(next);
    emit();
  }, []);

  const remove = useCallback((id: string | number) => {
    const sid = String(id);
    const next = read().filter((x) => x.id !== sid);
    write(next);
    setItems(next);
    emit();
  }, []);

  const clear = useCallback(() => {
    write([]);
    setItems([]);
    emit();
  }, []);

  const count = items.reduce((acc, x) => acc + x.qty, 0);
  const subtotal = items.reduce((acc, x) => acc + x.qty * x.price, 0);

  return {
    items,
    has,
    add,
    setQty,
    increment,
    decrement,
    remove,
    clear,
    count,
    subtotal,
  };
};

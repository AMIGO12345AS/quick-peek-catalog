import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "wishlist:v1";

const read = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

const write = (ids: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore quota errors */
  }
};

const EVENT = "wishlist:change";

export const useWishlist = () => {
  const [ids, setIds] = useState<string[]>(() => read());

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const has = useCallback((id: string | number) => ids.includes(String(id)), [ids]);

  const toggle = useCallback((id: string | number) => {
    const sid = String(id);
    const current = read();
    const next = current.includes(sid)
      ? current.filter((x) => x !== sid)
      : [...current, sid];
    write(next);
    setIds(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const remove = useCallback((id: string | number) => {
    const sid = String(id);
    const next = read().filter((x) => x !== sid);
    write(next);
    setIds(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const clear = useCallback(() => {
    write([]);
    setIds([]);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { ids, has, toggle, remove, clear, count: ids.length };
};

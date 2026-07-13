"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product, ProductOffer } from "@/lib/types";

export interface CartItem {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  offerId: string;
  offerQuantity: number;
  offerLabel: string;
  price: number;
  qty: number;
}

type Panel = "closed" | "cart" | "checkout";

interface CartContextValue {
  items: CartItem[];
  addOffer: (product: Product, offer: ProductOffer, qty?: number) => void;
  remove: (productId: string, offerId: string) => void;
  clear: () => void;
  count: number;
  total: number;
  panel: Panel;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  openCart: () => void;
  openCheckout: () => void;
  closePanel: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "lara-cart-v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [panel, setPanel] = useState<Panel>("closed");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addOffer = useCallback(
    (product: Product, offer: ProductOffer, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === product.id && i.offerId === offer.id
        );
        if (existing) {
          return prev.map((i) =>
            i.productId === product.id && i.offerId === offer.id
              ? { ...i, qty: i.qty + qty }
              : i
          );
        }
        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            sku: product.sku,
            name: product.name,
            offerId: offer.id,
            offerQuantity: offer.quantity,
            offerLabel: offer.label,
            price: offer.price,
            qty,
          },
        ];
      });
      setPanel("cart");
    },
    []
  );

  const remove = useCallback((productId: string, offerId: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.offerId === offerId))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addOffer,
      remove,
      clear,
      count,
      total,
      panel,
      isOpen: panel !== "closed",
      setOpen: (open: boolean) => setPanel(open ? "cart" : "closed"),
      openCart: () => setPanel("cart"),
      openCheckout: () => setPanel("checkout"),
      closePanel: () => setPanel("closed"),
    }),
    [items, addOffer, remove, clear, count, total, panel]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

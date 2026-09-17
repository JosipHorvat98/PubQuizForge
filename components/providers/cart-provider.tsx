// file: components/providers/cart-provider.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import type { User } from "@supabase/supabase-js";
import { useAuth } from "@/components/providers/auth-provider";

export type CartItem = {
  id: string;
  title: string;
  price: string;
  quantity: number;
};

type AddCartItemInput = {
  id: string;
  title: string;
  price: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  cartPulseKey: number;
  isHydrated: boolean;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const GUEST_CART_KEY = "pubquizforge_cart_guest";

function getUserCartKey(userId: string) {
  return `pubquizforge_cart_user_${userId}`;
}

function parsePrice(price: string): number {
  const numericValue = Number(price.replace("€", "").replace("EUR", "").trim());

  if (Number.isNaN(numericValue)) {
    return 0;
  }

  return numericValue;
}

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.price === "string" &&
    typeof item.quantity === "number" &&
    item.quantity >= 1
  );
}

function readCartFromStorage(storageKey: string): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidCartItem);
  } catch {
    return [];
  }
}

function writeCartToStorage(storageKey: string, items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {}
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartPulseKey, setCartPulseKey] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeStorageKey, setActiveStorageKey] = useState<string>(GUEST_CART_KEY);

  // Auth state comes from the single shared AuthProvider — no extra getUser()
  // call here, and the cart switches scopes as the user signs in/out.
  const { user, isAuthReady } = useAuth();

  const previousStorageKeyRef = useRef<string>(GUEST_CART_KEY);

  // Keep the current items reachable from a stable callback without recreating
  // switchCartScope on every cart change (which previously caused a loop:
  // addItem → callback identity change → effect re-runs → reads stale storage
  // and resets the cart to []).
  const itemsRef = useRef<CartItem[]>(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const switchCartScope = useCallback((currentUser: User | null) => {
    const nextStorageKey = currentUser ? getUserCartKey(currentUser.id) : GUEST_CART_KEY;
    const previousStorageKey = previousStorageKeyRef.current;

    writeCartToStorage(previousStorageKey, itemsRef.current);

    const nextItems = readCartFromStorage(nextStorageKey);

    previousStorageKeyRef.current = nextStorageKey;
    setActiveStorageKey(nextStorageKey);
    setItems(nextItems);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    switchCartScope(user);
    // Intentionally only on auth changes — NOT on switchCartScope identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthReady]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    writeCartToStorage(activeStorageKey, items);
  }, [activeStorageKey, isHydrated, items]);

  const addItem = useCallback((item: AddCartItemInput) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.id === item.id);

      if (existing) {
        return current.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });

    setCartPulseKey((value) => value + 1);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, Math.floor(quantity || 1)) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const count = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + parsePrice(item.price) * item.quantity,
        0
      ),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      total,
      cartPulseKey,
      isHydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart
    }),
    [
      items,
      count,
      total,
      cartPulseKey,
      isHydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
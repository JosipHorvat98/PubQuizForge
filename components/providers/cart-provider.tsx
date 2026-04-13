// file: components/providers/cart-provider.tsx
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from "react";

export type CartItem = {
    id: string;
    title: string;
    price: string;
    quantity: number;
};

type CartContextValue = {
    items: CartItem[];
    count: number;
    total: number;
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
};

const STORAGE_KEY = "pubquizforge_cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        try {
            const parsed = JSON.parse(raw) as CartItem[];
            setItems(Array.isArray(parsed) ? parsed : []);
        } catch {
            setItems([]);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    function addItem(item: Omit<CartItem, "quantity">) {
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
    }

    function removeItem(id: string) {
        setItems((current) => current.filter((item) => item.id !== id));
    }

    function updateQuantity(id: string, quantity: number) {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }

        setItems((current) =>
            current.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    }

    function clearCart() {
        setItems([]);
    }

    const count = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const total = useMemo(
        () =>
            items.reduce((sum, item) => {
                const numericPrice = Number(item.price.replace("€", ""));
                return sum + numericPrice * item.quantity;
            }, 0),
        [items]
    );

    const value = useMemo(
        () => ({
            items,
            count,
            total,
            addItem,
            removeItem,
            updateQuantity,
            clearCart
        }),
        [items, count, total]
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
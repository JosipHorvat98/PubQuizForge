// file: components/providers/cart-provider.tsx
"use client";

import {
    createContext,
    useCallback,
    useContext,
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
    addItem: (item: AddCartItemInput) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function parsePrice(price: string): number {
    const numericValue = Number(price.replace("€", "").trim());

    if (Number.isNaN(numericValue)) {
        return 0;
    }

    return numericValue;
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [cartPulseKey, setCartPulseKey] = useState(0);

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
                        ? { ...item, quantity: Math.max(1, quantity) }
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
            addItem,
            removeItem,
            updateQuantity,
            clearCart
        }),
        [items, count, total, cartPulseKey, addItem, removeItem, updateQuantity, clearCart]
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
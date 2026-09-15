// file: components/providers/auth-provider.tsx
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode
} from "react";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

type AuthContextValue = {
    user: User | null;
    isAuthReady: boolean;
    isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Single source of truth for the current user. Uses ONE shared Supabase
 * browser client and performs ONE getUser() + ONE onAuthStateChange subscription
 * for the whole app — instead of every component (Header, Cart, Memberships…)
 * spawning its own client and calling /auth/v1/user again.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const supabaseRef = useRef(createClient());
    const [user, setUser] = useState<User | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadUser() {
            const {
                data: { user: currentUser }
            } = await supabaseRef.current.auth.getUser();

            if (!isMounted) {
                return;
            }

            setUser(currentUser);
            setIsAuthReady(true);

            if (currentUser) {
                await refreshAdminFlag(currentUser.email);
            }
        }

        async function refreshAdminFlag(email?: string | null) {
            if (!email) {
                setIsAdmin(false);
                return;
            }

            try {
                const response = await fetch("/api/admin/me");
                const json = (await response.json()) as { isAdmin?: boolean };
                setIsAdmin(Boolean(json.isAdmin));
            } catch {
                setIsAdmin(false);
            }
        }

        void loadUser();

        const {
            data: { subscription }
        } = supabaseRef.current.auth.onAuthStateChange(
            (_event: AuthChangeEvent, session: Session | null) => {
                if (!isMounted) {
                    return;
                }

                setUser(session?.user ?? null);
                setIsAuthReady(true);

                if (session?.user) {
                    void refreshAdminFlag(session.user.email);
                } else {
                    setIsAdmin(false);
                }
            }
        );

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({ user, isAuthReady, isAdmin }),
        [user, isAuthReady, isAdmin]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}

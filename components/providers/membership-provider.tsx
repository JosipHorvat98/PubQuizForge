// file: components/providers/membership-provider.tsx
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
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import type { PlanEntitlements } from "@/lib/entitlements";
import type { StripeMembership } from "@/lib/memberships";

type MembershipInfo = {
    isMember: boolean;
    membership: StripeMembership | null;
    entitlements: PlanEntitlements | null;
    /** Legacy monthly membership-download counter (display only). */
    usageThisPeriod: number;
    /** Available pack credits, or null when the ledger isn't ready yet. */
    creditsAvailable: number | null;
    readonly creditsUsed: number;
    readonly creditsLedgerReady: boolean;
    readonly lookupFailed?: boolean;
    readonly loading?: boolean;
    readonly reload?: () => Promise<void>;
};

type MembershipContextValue = MembershipInfo & {
    loading: boolean;
    reload: () => Promise<void>;
};

const MembershipContext = createContext<MembershipContextValue | undefined>(
    undefined
);

const EMPTY: MembershipInfo = {
    isMember: false,
    membership: null,
    entitlements: null,
    usageThisPeriod: 0,
    creditsAvailable: null,
    creditsUsed: 0,
    creditsLedgerReady: false
};

export function MembershipProvider({ children }: { children: ReactNode }) {
    const [info, setInfo] = useState<MembershipInfo>(EMPTY);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    // Auth comes from the single shared AuthProvider — no extra client/
    // getUser here. Reloads below are debounced so mounting + pathname +
    // auth events collapse into ONE /api/membership/me call instead of 3-4.
    const { isAuthReady } = useAuth();
    const scheduleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inFlightRef = useRef(false);

    const reload = useCallback(async () => {
        try {
            // Do not gate on the client-side auth session here. After a
            // server-action login the cookie is set but the browser Supabase
            // client may not have synced yet, so `client.auth.getUser()` can
            // return null and skip the fetch. The server route reads the auth
            // cookie itself and returns the correct membership state.
            inFlightRef.current = true;
            const response = await fetch("/api/membership/me");
            const data = (await response.json()) as MembershipInfo;

            if (!response.ok) {
                setInfo({ ...EMPTY, lookupFailed: true });
                return;
            }

            setInfo(data);
        } catch {
            setInfo({ ...EMPTY, lookupFailed: true });
        } finally {
            inFlightRef.current = false;
            setLoading(false);
        }
    }, []);

    const debouncedReload = useCallback(() => {
        if (scheduleTimerRef.current) {
            clearTimeout(scheduleTimerRef.current);
        }

        if (inFlightRef.current) {
            return;
        }

        scheduleTimerRef.current = setTimeout(() => {
            void reload();
        }, 120);
    }, [reload]);

    useEffect(() => {
        return () => {
            if (scheduleTimerRef.current) {
                clearTimeout(scheduleTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isAuthReady) {
            return;
        }

        // Initial load once auth is known.
        debouncedReload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthReady]);

    useEffect(() => {
        if (!isAuthReady) {
            return;
        }

        // Refetch whenever the route changes so membership data (credits &
        // discount) appears right after a client-side navigation, e.g. after
        // the login redirect — without needing a manual page refresh.
        debouncedReload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, isAuthReady]);

    const value = useMemo<MembershipContextValue>(
        () => ({ ...info, loading, reload }),
        [info, loading, reload]
    );

    return (
        <MembershipContext.Provider value={value}>
            {children}
        </MembershipContext.Provider>
    );
}

export function useMembership() {
    const context = useContext(MembershipContext);

    if (!context) {
        throw new Error("useMembership must be used inside MembershipProvider");
    }

    return context;
}

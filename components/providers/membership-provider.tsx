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
import {
    createClient
} from "@/utils/supabase/client";
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
    const supabaseRef = useRef(createClient());

    const reload = useCallback(async () => {
        try {
            // Do not gate on the client-side auth session here. After a
            // server-action login the cookie is set but the browser Supabase
            // client may not have synced yet, so `client.auth.getUser()` can
            // return null and skip the fetch. The server route reads the auth
            // cookie itself and returns the correct membership state.
            const response = await fetch("/api/membership/me");
            const data = (await response.json()) as MembershipInfo;

            if (!response.ok) {
                setInfo({ ...EMPTY, lookupFailed: true });
                return;
            }

            setInfo(data);
        } catch {
            setInfo({ ...EMPTY, lookupFailed: true });
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const refresh = async () => {
            await reload();

            if (isMounted) {
                setLoading(false);
            }
        };

        void refresh();

        const {
            data: { subscription }
        } = supabaseRef.current.auth.onAuthStateChange((_event, session) => {
            const user = session?.user ?? null;

            if (!isMounted) {
                return;
            }

            setLoading(true);
            setInfo(EMPTY);

            if (user) {
                void reload().then(() => {
                    if (isMounted) {
                        setLoading(false);
                    }
                });
            } else {
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [reload]);

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

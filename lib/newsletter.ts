// file: lib/newsletter.ts
import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type NewsletterSubscriber = {
    id: string;
    email: string;
    is_active: boolean;
    source: string;
    created_at: string;
    unsubscribed_at: string | null;
};

/**
 * Adds an email to the opt-in newsletter list. Idempotent: re-subscribing the
 * same email simply reactivates it instead of creating a duplicate row.
 */
export async function subscribeNewsletter(
    email: string,
    source = "footer"
): Promise<boolean> {
    const normalized = email.trim().toLowerCase();

    if (!normalized) {
        return false;
    }

    const existingQuery = await supabaseAdmin
        .from("newsletter_subscribers")
        .select("id, is_active")
        .eq("email", normalized)
        .maybeSingle();

    if (!existingQuery.error && existingQuery.data) {
        const { error } = await supabaseAdmin
            .from("newsletter_subscribers")
            .update({ is_active: true, unsubscribed_at: null })
            .eq("id", existingQuery.data.id);

        return !error;
    }

    const { error } = await supabaseAdmin
        .from("newsletter_subscribers")
        .insert({ email: normalized, source });

    return !error;
}

/** Marks an address as unsubscribed (soft delete, keeps the audit trail). */
export async function unsubscribeNewsletter(email: string): Promise<boolean> {
    const normalized = email.trim().toLowerCase();

    const { error } = await supabaseAdmin
        .from("newsletter_subscribers")
        .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
        .eq("email", normalized);

    return !error;
}

export async function listNewsletterSubscribers(): Promise<
    NewsletterSubscriber[]
> {
    const { data, error } = await supabaseAdmin
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[newsletter] unable to list subscribers:", error.message);
        return [];
    }

    return (data ?? []) as NewsletterSubscriber[];
}

export async function countActiveNewsletterSubscribers(): Promise<number> {
    const { count, error } = await supabaseAdmin
        .from("newsletter_subscribers")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true);

    if (error) {
        console.error("[newsletter] unable to count subscribers:", error.message);
        return 0;
    }

    return count ?? 0;
}
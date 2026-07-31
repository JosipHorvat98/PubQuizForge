// file: app/api/admin/users/[id]/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isActiveSubscriptionStatus } from "@/lib/subscriptions";

export async function DELETE(
    _request: Request,
    context: {
        params: Promise<{ id: string }>;
    }
) {
    try {
        const admin = await requireAdmin();
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: "Missing user ID" },
                { status: 400 }
            );
        }

        if (admin.id === id) {
            return NextResponse.json(
                { error: "You cannot delete your own admin account." },
                { status: 400 }
            );
        }

        const { data: targetUser, error: targetUserError } =
            await supabaseAdmin.auth.admin.getUserById(id);

        if (targetUserError || !targetUser.user) {
            return NextResponse.json(
                { error: "User was not found." },
                { status: 404 }
            );
        }

        const { data: subscriptions, error: subscriptionError } =
            await supabaseAdmin
                .from("subscriptions")
                .select("status")
                .eq("user_id", id);

        if (subscriptionError) {
            throw subscriptionError;
        }

        const hasActiveSubscription = (subscriptions ?? []).some(
            (subscription) =>
                isActiveSubscriptionStatus(subscription.status)
        );

        if (hasActiveSubscription) {
            return NextResponse.json(
                {
                    error:
                        "This user still has an active Stripe subscription. Cancel the subscription first."
                },
                { status: 409 }
            );
        }

        const email = targetUser.user.email;

        if (email) {
            const { error: downloadsError } = await supabaseAdmin
                .from("downloads")
                .delete()
                .eq("email", email);

            if (downloadsError) {
                throw downloadsError;
            }
        }

        const { error: deleteUserError } =
            await supabaseAdmin.auth.admin.deleteUser(id);

        if (deleteUserError) {
            throw deleteUserError;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin delete user error:", error);

        const message =
            error instanceof Error ? error.message : "Unable to delete user.";

        const status =
            message === "Unauthorized"
                ? 401
                : message === "Forbidden"
                    ? 403
                    : 500;

        return NextResponse.json({ error: message }, { status });
    }
}

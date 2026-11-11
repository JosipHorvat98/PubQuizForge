// file: app/api/admin/newsletter/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/admin-audit";
import {
    listNewsletterSubscribers,
    unsubscribeNewsletter
} from "@/lib/newsletter";
import {
    sendNewsletterBroadcastEmail,
    newsletterTextToHtml,
    type NewsletterBroadcastResult
} from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await requireAdmin();
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscribers = await listNewsletterSubscribers();

    return NextResponse.json({ subscribers });
}

export async function POST(request: Request) {
    let adminEmail = "";

    try {
        const admin = await requireAdmin();
        adminEmail = admin.email ?? "";
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
        subject?: string;
        html?: string;
        text?: string;
    };

    const subject = (body.subject ?? "").trim();
    const providedHtml = (body.html ?? "").trim();
    const text = (body.text ?? "").trim();
    const html = providedHtml || (text ? newsletterTextToHtml(text) : "");

    if (!subject || !html) {
        return NextResponse.json(
            { error: "Subject and message are required" },
            { status: 400 }
        );
    }

    const subscribers = await listNewsletterSubscribers();
    const recipients = subscribers
        .filter((entry) => entry.is_active)
        .map((entry) => entry.email);

    if (!recipients.length) {
        return NextResponse.json(
            { error: "No active subscribers yet" },
            { status: 400 }
        );
    }

    let outcome: NewsletterBroadcastResult;

    try {
        outcome = await sendNewsletterBroadcastEmail({
            to: recipients,
            subject,
            html
        });
    } catch (error) {
        console.error("Newsletter broadcast failed:", error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to send the broadcast."
            },
            { status: 500 }
        );
    }

    await logAdminAction({
        adminEmail,
        action: "newsletter_broadcast",
        entityType: "newsletter",
        meta: {
            subject,
            recipientCount: recipients.length,
            sent: outcome.sent,
            failed: outcome.failed
        }
    });

    if (outcome.sent === 0) {
        return NextResponse.json(
            {
                error:
                    outcome.errors[0] ??
                    "Unable to deliver the broadcast to any subscriber.",
                sent: outcome.sent,
                failed: outcome.failed,
                errors: outcome.errors
            },
            { status: 502 }
        );
    }

    return NextResponse.json({
        success: true,
        sent: outcome.sent,
        failed: outcome.failed,
        errors: outcome.errors
    });
}

export async function DELETE(request: Request) {
    let adminEmail = "";

    try {
        const admin = await requireAdmin();
        adminEmail = admin.email ?? "";
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { email?: string };
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await unsubscribeNewsletter(email);

    await logAdminAction({
        adminEmail,
        action: "newsletter_unsubscribe",
        entityType: "newsletter",
        entityId: email,
        meta: { email }
    });

    return NextResponse.json({ success: true });
}

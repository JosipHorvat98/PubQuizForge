// file: app/api/admin/newsletter/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/admin-audit";
import {
    listNewsletterSubscribers,
    unsubscribeNewsletter
} from "@/lib/newsletter";
import { sendNewsletterBroadcastEmail } from "@/lib/email";

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
    };

    const subject = (body.subject ?? "").trim();
    const html = (body.html ?? "").trim();

    if (!subject || !html) {
        return NextResponse.json(
            { error: "Subject and content are required" },
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

    try {
        await sendNewsletterBroadcastEmail({ to: recipients, subject, html });
    } catch (error) {
        console.error("Newsletter broadcast failed:", error);
        return NextResponse.json(
            { error: "Unable to send the broadcast. Check the EMAIL_FROM domain setup." },
            { status: 500 }
        );
    }

    await logAdminAction({
        adminEmail,
        action: "newsletter_broadcast",
        entityType: "newsletter",
        meta: { subject, recipientCount: recipients.length }
    });

    return NextResponse.json({ success: true, sent: recipients.length });
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

// file: app/api/test-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function getEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing ${name}`);
    }
    return value;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const EMAIL_FROM =
    process.env.EMAIL_FROM || "PubQuizForge <onboarding@resend.dev>";

export async function GET() {
    // Only admins may trigger a diagnostic email.
    await requireAdmin();

    if (!RESEND_API_KEY) {
        return NextResponse.json(
            { ok: false, error: "RESEND_API_KEY is not set on this environment." },
            { status: 500 }
        );
    }

    const resend = new Resend(RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: EMAIL_FROM,
            to: ["jojohorvat@gmail.com"],
            subject: "PubQuizForge test email ✅",
            html: "<h2>Test email from PubQuizForge</h2><p>If you can read this, Resend is configured correctly and can deliver to this address.</p>"
        });

        if (error) {
            return NextResponse.json(
                { ok: false, error: String(error) },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true, id: data?.id });
    } catch (error) {
        console.error("Test email failed:", error);
        return NextResponse.json(
            { ok: false, error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
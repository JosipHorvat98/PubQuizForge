// file: app/api/newsletter/route.ts
import { NextResponse } from "next/server";
import { subscribeNewsletter } from "@/lib/newsletter";
import { sendNewsletterConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as { email?: string };

        const email = (body.email ?? "").trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address" },
                { status: 400 }
            );
        }

        const ok = await subscribeNewsletter(email, "footer");

        if (!ok) {
            throw new Error("Database insert failed");
        }

        // Confirmation to the subscriber — best-effort.
        try {
            await sendNewsletterConfirmationEmail(email);
        } catch (error) {
            console.error("Newsletter confirmation email failed:", error);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Newsletter subscribe error:", error);

        return NextResponse.json(
            { error: "Unable to subscribe. Please try again." },
            { status: 500 }
        );
    }
}

// file: app/api/contact/route.ts
import { NextResponse } from "next/server";
import { sendContactMessageEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as {
            name?: string;
            email?: string;
            subject?: string;
            message?: string;
        };

        const name = (body.name ?? "").trim();
        const email = (body.email ?? "").trim().toLowerCase();
        const subject = (body.subject ?? "").trim() || "Contact form message";
        const message = (body.message ?? "").trim();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email, and message are required" },
                { status: 400 }
            );
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address" },
                { status: 400 }
            );
        }

        // Notify the publisher (you) — best-effort like other emails.
        try {
            await sendContactMessageEmail({ name, email, subject, message });
        } catch (error) {
            console.error("Contact email failed:", error);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact message error:", error);

        return NextResponse.json(
            { error: "Unable to send your message. Please try again." },
            { status: 500 }
        );
    }
}

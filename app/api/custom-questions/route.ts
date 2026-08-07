// file: app/api/custom-questions/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
    sendCustomQuestionConfirmationEmail,
    sendCustomQuestionEmail,
    type CustomQuestionSubmission
} from "@/lib/email";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as {
            name?: string;
            email?: string;
            theme?: string;
            questionCount?: number;
            details?: string;
        };

        const name = (body.name ?? "").trim();
        const email = (body.email ?? "").trim().toLowerCase();
        const theme = (body.theme ?? "").trim();
        const details = (body.details ?? "").trim() || null;

        if (!name || !email) {
            return NextResponse.json(
                { error: "Name and email are required" },
                { status: 400 }
            );
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address" },
                { status: 400 }
            );
        }

        const questionCount = Number(body.questionCount) || 10;

        const submission: CustomQuestionSubmission = {
            name,
            email,
            theme: theme || "Other",
            questionCount,
            details
        };

        const { error } = await supabaseAdmin
            .from("custom_questions")
            .insert(submission);

        if (error) {
            throw error;
        }

        // Notify the publisher (you) — best-effort.
        try {
            await sendCustomQuestionEmail(submission);
        } catch (error) {
            console.error("Custom question email failed:", error);
        }

        // Confirmation to the customer — best-effort.
        try {
            await sendCustomQuestionConfirmationEmail(submission);
        } catch (error) {
            console.error("Custom question confirmation email failed:", error);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Custom questions error:", error);

        return NextResponse.json(
            { error: "Unable to submit your request. Please try again." },
            { status: 500 }
        );
    }
}
// file: lib/email.ts
// Transactional email via Resend. Every send is best-effort and no-ops when the
// RESEND_API_KEY is not configured, so the app keeps working before setup.
import "server-only";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Pack } from "@/data/site";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const EMAIL_FROM =
    process.env.EMAIL_FROM || "PubQuizForge <onboarding@resend.dev>";
const PUBLISHER_EMAIL = (process.env.PUBLISHER_EMAIL ?? "").trim().toLowerCase();
const STORAGE_BUCKET = process.env.PACK_STORAGE_BUCKET || "pack-pdfs";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export type CustomQuestionSubmission = {
    name: string;
    email: string;
    theme: string;
    questionCount: number;
    details: string | null;
};

function resendOrNull(): Resend | null {
    if (!RESEND_API_KEY) {
        console.warn(
            "[email] RESEND_API_KEY is not set; skipping email send."
        );
        return null;
    }

    return new Resend(RESEND_API_KEY);
}

function objectNameFromPdfPath(pdfPath?: string | null): string | null {
    if (!pdfPath) {
        return null;
    }

    const base = pdfPath.split("/").pop();

    return base && base.toLowerCase().endsWith(".pdf") ? base : null;
}

function formatEuroCents(cents: number | null): string | null {
    if (cents === null || cents === undefined) {
        return null;
    }

    return `€${(cents / 100).toFixed(2)}`;
}

async function downloadPdfAttachments(
    packs: Pack[]
): Promise<Array<{ filename: string; content: Buffer }>> {
    const attachments = [];

    for (const pack of packs) {
        const objectName = objectNameFromPdfPath(pack.pdfPath);

        if (!objectName) {
            continue;
        }

        try {
            const { data, error } = await supabaseAdmin.storage
                .from(STORAGE_BUCKET)
                .download(objectName);

            if (error || !data) {
                console.warn(`[email] cannot download ${objectName}:`, error?.message);
                continue;
            }

            attachments.push({
                filename: objectName,
                content: Buffer.from(await data.arrayBuffer())
            });
        } catch (error) {
            console.error(`[email] unable to attach ${objectName}:`, error);
        }
    }

    return attachments;
}
/**
 * Sends the purchased pack PDFs (from the private Storage bucket) to the buyer
 * together with an order summary and the Stripe receipt link.
 */
export async function sendPackPurchaseEmail(opts: {
    to: string;
    packs: Pack[];
    amountTotalCents: number | null;
    receiptUrl?: string | null;
}): Promise<void> {
    const resend = resendOrNull();

    if (!resend) {
        return;
    }

    const attachments = await downloadPdfAttachments(opts.packs);

    const itemsHtml = opts.packs
        .map((pack) => `<li>${pack.title}</li>`)
        .join("");

    const total = formatEuroCents(opts.amountTotalCents);
    const receiptHtml = opts.receiptUrl
        ? `<p>Your receipt: <a href="${opts.receiptUrl}">View receipt</a></p>`
        : "";

    const html = [
        `<h2>Thanks for your order! 🎉</h2>`,
        `<p>Your question packs are attached as PDFs (also downloadable any time from your <a href="${SITE_URL}/downloads">downloads</a> page).</p>`,
        `<h3>Order summary</h3>`,
        `<ul>${itemsHtml}</ul>`,
        total ? `<p><strong>Total: ${total}</strong></p>` : "",
        receiptHtml,
        `<p>Happy quizzing! — PubQuizForge</p>`
    ]
        .filter(Boolean)
        .join("\n");

    await resend.emails.send({
        from: EMAIL_FROM,
        to: [opts.to],
        subject: "Your PubQuizForge order 🎉",
        html,
        attachments
    });
}

/** Confirmation for a new membership subscription (no PDF attachments). */
export async function sendMembershipConfirmationEmail(opts: {
    to: string;
    planName: string;
}): Promise<void> {
    const resend = resendOrNull();

    if (!resend) {
        return;
    }

    const html = [
        `<h2>Welcome to ${opts.planName}! 🥂</h2>`,
        `<p>Your membership is active. Use your pack credits on the <a href="${SITE_URL}/memberships">membership page</a> and download packs at any time from your <a href="${SITE_URL}/downloads">downloads</a>.</p>`,
        `<p>Happy quizzing! — PubQuizForge</p>`
    ].join("\n");

    await resend.emails.send({
        from: EMAIL_FROM,
        to: [opts.to],
        subject: `Welcome to ${opts.planName}`,
        html
    });
}

/** Notifies the publisher (you) about a custom question request. */
export async function sendCustomQuestionEmail(
    submission: CustomQuestionSubmission
): Promise<void> {
    const resend = resendOrNull();

    if (!resend) {
        return;
    }

    if (!PUBLISHER_EMAIL) {
        console.warn(
            "[email] PUBLISHER_EMAIL is not set; custom-question email not sent."
        );
        return;
    }

    const html = [
        `<h2>New custom question request</h2>`,
        `<p><strong>Name:</strong> ${submission.name}</p>`,
        `<p><strong>Email:</strong> ${submission.email}</p>`,
        `<p><strong>Theme:</strong> ${submission.theme}</p>`,
        `<p><strong>Question count:</strong> ${submission.questionCount}</p>`,
        submission.details
            ? `<p><strong>Details:</strong><br/>${submission.details.replace(/\n/g, "<br/>")}</p>`
            : "",
        `<hr/>`,
        `<p>Reply directly to this email or use the reply-to address to contact the customer.</p>`
    ]
        .filter(Boolean)
        .join("\n");

    await resend.emails.send({
        from: EMAIL_FROM,
        to: [PUBLISHER_EMAIL],
        replyTo: submission.email,
        subject: `New custom question request from ${submission.name}`,
        html
    });
}

/** Optional confirmation sent back to whoever submitted a custom question. */
export async function sendCustomQuestionConfirmationEmail(
    submission: CustomQuestionSubmission
): Promise<void> {
    const resend = resendOrNull();

    if (!resend) {
        return;
    }

    const html = [
        `<h2>We received your request! ✍️</h2>`,
        `<p>Hi ${submission.name},</p>`,
        `<p>Thanks for your custom question request (<strong>${submission.theme}</strong>). We'll get back to you at <strong>${submission.email}</strong> as soon as it's ready.</p>`,
        `<p>— PubQuizForge</p>`
    ].join("\n");

    await resend.emails.send({
        from: EMAIL_FROM,
        to: [submission.email],
        subject: "We received your custom question request",
        html
    });
}

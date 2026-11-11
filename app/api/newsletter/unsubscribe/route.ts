// file: app/api/newsletter/unsubscribe/route.ts
import { NextResponse } from "next/server";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";
import { unsubscribeNewsletter } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://pubquizforge.com";

function page(title: string, message: string, status: number) {
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title></head><body style="font-family:Arial,Helvetica,sans-serif;background:#0b0b0d;color:#f5f5f5;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;"><div style="max-width:480px;padding:40px;text-align:center;"><h1 style="font-size:24px;margin:0 0 12px;">${title}</h1><p style="color:#b3b3b3;line-height:1.6;margin:0;">${message}</p><p style="margin-top:24px;"><a href="${SITE_URL}" style="color:#f5c842;">Back to PubQuizForge</a></p></div></body></html>`;

    return new NextResponse(html, {
        status,
        headers: { "Content-Type": "text/html; charset=utf-8" }
    });
}

async function handle(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = (searchParams.get("email") ?? "").trim().toLowerCase();
    const token = searchParams.get("token") ?? "";

    if (!email || !token || !verifyUnsubscribeToken(email, token)) {
        return page(
            "Invalid link",
            "This unsubscribe link is invalid or has expired.",
            400
        );
    }

    await unsubscribeNewsletter(email);

    return page(
        "You&apos;re unsubscribed",
        "You will no longer receive the PubQuizForge newsletter. Sorry to see you go!",
        200
    );
}

export async function GET(request: Request) {
    return handle(request);
}

// Supports one-click unsubscribe (List-Unsubscribe-Post) from mail clients.
export async function POST(request: Request) {
    return handle(request);
}

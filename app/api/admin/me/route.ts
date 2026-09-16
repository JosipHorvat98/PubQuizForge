// file: app/api/admin/me/route.ts
import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/admin-auth";
import { hasSessionCookie } from "@/lib/session-cookie";

export const dynamic = "force-dynamic";

export async function GET() {
    // Cheap gate: no session cookie -> not an admin, skip the auth round-trip.
    if (!(await hasSessionCookie())) {
        return NextResponse.json({ isAdmin: false });
    }

    try {
        const isAdmin = await isAdminUser();
        return NextResponse.json({ isAdmin });
    } catch (error) {
        console.error("Admin check error:", error);
        return NextResponse.json({ isAdmin: false });
    }
}
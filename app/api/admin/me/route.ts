// file: app/api/admin/me/route.ts
import { NextResponse } from "next/server";
import { getAdminRole } from "@/lib/admin-auth";
import { hasSessionCookie } from "@/lib/session-cookie";

export const dynamic = "force-dynamic";

export async function GET() {
    // Cheap gate: no session cookie -> not an admin, skip the auth round-trip.
    if (!(await hasSessionCookie())) {
        return NextResponse.json({ isAdmin: false, isEditor: false, role: null });
    }

    try {
        const role = await getAdminRole();

        return NextResponse.json({
            isAdmin: role === "super_admin",
            isEditor: role === "editor",
            role
        });
    } catch (error) {
        console.error("Admin check error:", error);
        return NextResponse.json({ isAdmin: false, isEditor: false, role: null });
    }
}
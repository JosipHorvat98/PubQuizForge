// file: app/api/admin/me/route.ts
import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const isAdmin = await isAdminUser();
        return NextResponse.json({ isAdmin });
    } catch (error) {
        console.error("Admin check error:", error);
        return NextResponse.json({ isAdmin: false });
    }
}
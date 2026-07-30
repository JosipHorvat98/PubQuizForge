// file: app/api/admin/users/[id]/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(
    _request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json({ error: "Missing user id" }, { status: 400 });
        }

        const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

        if (error) {
            console.error("Delete user error:", error);
            return NextResponse.json(
                { error: "Unable to delete user" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin delete route error:", error);

        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
}
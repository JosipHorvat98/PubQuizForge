// file: app/api/admin/custom-questions/[id]/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: "Missing request id" },
                { status: 400 }
            );
        }

        const body = (await request.json()) as { is_handled?: boolean };

        const { data, error } = await supabaseAdmin
            .from("custom_questions")
            .update({ is_handled: body.is_handled === true })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({ row: data });
    } catch (error) {
        console.error("Admin update custom question error:", error);

        const message =
            error instanceof Error ? error.message : "Unable to update request";

        const status =
            message === "Unauthorized"
                ? 401
                : message === "Forbidden"
                    ? 403
                    : 500;

        return NextResponse.json({ error: message }, { status });
    }
}

export async function DELETE(
    _request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: "Missing request id" },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from("custom_questions")
            .delete()
            .eq("id", id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin delete custom question error:", error);

        const message =
            error instanceof Error ? error.message : "Unable to delete request";

        const status =
            message === "Unauthorized"
                ? 401
                : message === "Forbidden"
                    ? 403
                    : 500;

        return NextResponse.json({ error: message }, { status });
    }
}
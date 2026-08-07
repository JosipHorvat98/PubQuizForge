// file: app/api/admin/news/[id]/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

function slugify(value: string): string {
    return (
        value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 80) || "post"
    );
}

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();

        const { id } = await context.params;

        const body = (await request.json()) as {
            title?: string;
            category?: string;
            content?: string;
            is_published?: boolean;
        };

        if (!id) {
            return NextResponse.json(
                { error: "Missing post id" },
                { status: 400 }
            );
        }

        const { data: existing, error: fetchError } = await supabaseAdmin
            .from("news_posts")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (fetchError) {
            throw fetchError;
        }

        if (!existing) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        const title =
            typeof body.title === "string" && body.title.trim()
                ? body.title.trim()
                : existing.title;

        const category =
            typeof body.category === "string" && body.category.trim()
                ? body.category.trim()
                : existing.category;

        const content =
            typeof body.content === "string"
                ? body.content.trim()
                : existing.content;

        const isPublished =
            typeof body.is_published === "boolean"
                ? body.is_published
                : existing.is_published;

        const publishedAt =
            isPublished && !existing.published_at
                ? new Date().toISOString()
                : existing.published_at;

        const { data, error } = await supabaseAdmin
            .from("news_posts")
            .update({
                slug: slugify(title),
                title,
                category,
                content,
                is_published: isPublished,
                published_at: publishedAt,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({ post: data });
    } catch (error) {
        console.error("Admin update news error:", error);

        const message =
            error instanceof Error ? error.message : "Unable to update post";

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
                { error: "Missing post id" },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from("news_posts")
            .delete()
            .eq("id", id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin delete news error:", error);

        const message =
            error instanceof Error ? error.message : "Unable to delete post";

        const status =
            message === "Unauthorized"
                ? 401
                : message === "Forbidden"
                    ? 403
                    : 500;

        return NextResponse.json({ error: message }, { status });
    }
}
// file: app/api/admin/news/route.ts
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

async function uniqueSlug(base: string): Promise<string> {
    let candidate = base;
    let index = 1;

    for (;;) {
        const { data } = await supabaseAdmin
            .from("news_posts")
            .select("id")
            .eq("slug", candidate)
            .maybeSingle();

        if (!data) {
            return candidate;
        }

        candidate = `${base}-${index}`;
        index += 1;
    }
}

export async function POST(request: Request) {
    try {
        await requireAdmin();

        const body = (await request.json()) as {
            title?: string;
            category?: string;
            content?: string;
            is_published?: boolean;
        };

        const title = (body.title ?? "").trim();

        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        const category = (body.category ?? "Update").trim() || "Update";
        const content = (body.content ?? "").trim();
        const isPublished = body.is_published === true;

        const slug = await uniqueSlug(slugify(title));

        const { data, error } = await supabaseAdmin
            .from("news_posts")
            .insert({
                slug,
                title,
                category,
                content,
                is_published: isPublished,
                published_at: isPublished ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({ post: data });
    } catch (error) {
        console.error("Admin create news error:", error);

        const message =
            error instanceof Error ? error.message : "Unable to create post";

        const status =
            message === "Unauthorized"
                ? 401
                : message === "Forbidden"
                    ? 403
                    : 500;

        return NextResponse.json({ error: message }, { status });
    }
}
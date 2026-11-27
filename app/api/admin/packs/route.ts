// file: app/api/admin/packs/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/admin-audit";
import { normalizePrice } from "@/lib/price";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getPackOverrides, getPacksMerged } from "@/lib/packs-server";
import type { PackTier } from "@/data/site";

export const dynamic = "force-dynamic";

const TIERS: PackTier[] = ["free", "bronze", "silver", "gold"];

function nullable(value: unknown): string | null {
    const text = String(value ?? "").trim();

    return text ? text : null;
}

export async function GET() {
    try {
        await requireAdmin();
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [packs, overrides] = await Promise.all([
        getPacksMerged(),
        getPackOverrides()
    ]);

    return NextResponse.json({
        packs,
        overrides: Object.fromEntries(overrides)
    });
}

export async function PATCH(request: Request) {
    let adminEmail = "";

    try {
        const admin = await requireAdmin();
        adminEmail = admin.email ?? "";
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
        packId?: string;
        tier?: string | null;
        price?: string | null;
        title?: string | null;
        pdfPath?: string | null;
        isHidden?: boolean;
    };

    const packId = (body.packId ?? "").trim();

    if (!packId) {
        return NextResponse.json({ error: "Missing packId" }, { status: 400 });
    }

    const rawTier = nullable(body.tier);

    if (rawTier && !TIERS.includes(rawTier as PackTier)) {
        return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const now = new Date().toISOString();

    const rawPrice = nullable(body.price);
    const normalizedPrice = rawPrice === null ? null : normalizePrice(rawPrice);

    if (rawPrice !== null && normalizedPrice === null) {
        return NextResponse.json(
            { error: "Invalid price. Use a number such as 4.99." },
            { status: 400 }
        );
    }

    const { error } = await supabaseAdmin.from("pack_overrides").upsert(
        {
            pack_id: packId,
            tier: rawTier,
            price: normalizedPrice,
            title: nullable(body.title),
            pdf_path: nullable(body.pdfPath),
            is_hidden: Boolean(body.isHidden),
            updated_at: now
        },
        { onConflict: "pack_id" }
    );

    if (error) {
        return NextResponse.json(
            {
                error:
                    error.message.includes("does not exist")
                        ? "Run migration 004_pack_overrides.sql in Supabase first."
                        : error.message
            },
            { status: 500 }
        );
    }

    await logAdminAction({
        adminEmail,
        action: "pack_override_update",
        entityType: "pack",
        entityId: packId,
        meta: {
            tier: rawTier,
            price: normalizedPrice,
            is_hidden: Boolean(body.isHidden)
        }
    });

    const packs = await getPacksMerged();
    const pack = packs.find((candidate) => candidate.id === packId) ?? null;

    return NextResponse.json({ pack });
}

// file: app/api/packs/route.ts
import { NextResponse } from "next/server";
import { getPacksMerged } from "@/lib/packs-server";

export const dynamic = "force-dynamic";

export async function GET() {
    const packs = await getPacksMerged();

    return NextResponse.json({ packs });
}

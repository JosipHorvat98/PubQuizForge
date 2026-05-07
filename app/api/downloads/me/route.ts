// file: app/api/downloads/me/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("downloads")
      .select("id, title, email, type, created_at, pack_slug, download_url")
      .eq("email", user.email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase select error:", error);
      return NextResponse.json(
        { error: "Unable to load downloads" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      email: user.email,
      downloads: data ?? []
    });
  } catch (error) {
    console.error("Downloads me error:", error);
    return NextResponse.json(
      { error: "Unable to load downloads" },
      { status: 500 }
    );
  }
}
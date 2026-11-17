// file: scripts/upload-pack-pdf.mjs
// One-off helper: upload a pack PDF into the private Supabase Storage bucket
// and verify it is downloadable via a signed URL.
//
// Usage: node scripts/upload-pack-pdf.mjs <source.pdf> <object-name.pdf>

import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { createClient } from "@supabase/supabase-js";

const BUCKET = process.env.PACK_STORAGE_BUCKET || "pack-pdfs";
const source = process.argv[2];
const objectName = process.argv[3] ?? (source ? basename(source) : null);

if (!source || !objectName) {
    console.error(
        "Usage: node scripts/upload-pack-pdf.mjs <source.pdf> <object-name.pdf>"
    );
    process.exit(1);
}

function loadEnv(path) {
    const env = {};
    const text = readFileSync(path, "utf8");

    for (const line of text.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);

        if (!match) {
            continue;
        }

        let value = match[2].trim();

        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        env[match[1]] = value;
    }

    return env;
}

const env = loadEnv(".env.local");
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
});

const bytes = readFileSync(source);
console.log(`Source : ${source} (${bytes.length} bytes)`);
console.log(`Object : ${BUCKET}/${objectName}`);

const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

if (bucketsError) {
    console.error("Cannot list buckets:", bucketsError.message);
    process.exit(1);
}

if (!buckets.some((bucket) => bucket.name === BUCKET)) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET, {
        public: false
    });

    if (createError) {
        console.error(`Cannot create bucket ${BUCKET}:`, createError.message);
        process.exit(1);
    }

    console.log(`Created private bucket ${BUCKET}`);
}

const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(objectName, bytes, {
        contentType: "application/pdf",
        upsert: true
    });

if (uploadError) {
    console.error("Upload failed:", uploadError.message);
    process.exit(1);
}

console.log("Upload OK");

const { data: signed, error: signedError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(objectName, 60);

if (signedError || !signed?.signedUrl) {
    console.error("Cannot create signed URL:", signedError?.message);
    process.exit(1);
}

const response = await fetch(signed.signedUrl);
const downloaded = Buffer.from(await response.arrayBuffer());

console.log(
    `Verified: HTTP ${response.status}, ${downloaded.length} bytes, starts with %PDF: ${downloaded
        .subarray(0, 4)
        .toString("ascii") === "%PDF"}`
);

const packId = objectName.replace(/\.pdf$/i, "");
const { data: overrides, error: overridesError } = await supabase
    .from("pack_overrides")
    .select("pack_id, tier, price, title, pdf_path, is_hidden")
    .eq("pack_id", packId);

if (overridesError) {
    console.log(`pack_overrides check skipped: ${overridesError.message}`);
} else {
    console.log(
        `pack_overrides for ${packId}:`,
        overrides.length > 0 ? JSON.stringify(overrides) : "none"
    );
}

// file: scripts/upload-packs.mjs
// Uploads the pack PDFs from ./public/packs into a PRIVATE Supabase Storage
// bucket so they can only be served as short-lived signed URLs.
//
// Usage (from the repo root):
//   $env:SUPABASE_URL="https://xyz.supabase.co"
//   $env:SUPABASE_SERVICE_ROLE_KEY="service_role_key"
//   $env:PACK_STORAGE_BUCKET="pack-pdfs"   # optional
//   node scripts/upload-packs.mjs
//
// The service-role key is read-only required; you can also run the equivalent
// SQL in the Supabase dashboard (see supabase/migrations/001_pack_pdf_storage.sql).

import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(root, "public", "packs");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.PACK_STORAGE_BUCKET || "pack-pdfs";

if (!url || !key) {
    console.error("Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY env vars.");
    process.exit(1);
}

const supabase = createClient(url, key);

async function ensureBucket() {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = (buckets ?? []).some((b) => b.id === bucket);

    if (exists) {
        return;
    }

    const { error } = await supabase.storage.createBucket(bucket, {
        public: false
    });

    if (error) {
        throw new Error(`Unable to create bucket "${bucket}": ${error.message}`);
    }

    console.log(`Created private bucket "${bucket}".`);
}

async function uploadPacks() {
    let files;

    try {
        files = await readdir(sourceDir);
    } catch (error) {
        console.error(`No packs directory found at ${sourceDir}.`, error);
        process.exit(1);
    }

    const pdfs = files.filter((name) => name.toLowerCase().endsWith(".pdf"));

    if (!pdfs.length) {
        console.log("No PDFs found in public/packs. Nothing to upload.");
        return;
    }

    console.log(`Uploading ${pdfs.length} PDF(s) to "${bucket}"...`);

    for (const name of pdfs) {
        const data = await readFile(join(sourceDir, name));
        const { error } = await supabase.storage
            .from(bucket)
            .upload(name, data, { upsert: true, contentType: "application/pdf" });

        if (error) {
            console.error(`  Failed ${name}: ${error.message}`);
            continue;
        }

        console.log(`  Uploaded ${name}`);
    }
}

await ensureBucket();
await uploadPacks();

console.log("Done. You can now delete public/packs/*.pdf so files are only in Storage.");

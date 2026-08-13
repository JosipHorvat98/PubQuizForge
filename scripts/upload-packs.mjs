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
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(root, "public", "packs");

// Load .env.local so this script works without manually setting env vars.
function loadEnvLocal() {
  const envPath = join(root, ".env.local");
  const out = {};
  if (!existsSync(envPath)) return out;
  try {
    const text = readFileSync(envPath, "utf8");
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      out[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
  } catch {}
  return out;
}

const env = { ...process.env, ...loadEnvLocal() };
const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = env.PACK_STORAGE_BUCKET || "pack-pdfs";

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

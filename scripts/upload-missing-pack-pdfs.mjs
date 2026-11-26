// file: scripts/upload-missing-pack-pdfs.mjs
// Bulk uploads pack PDFs for every pack that still has `pdfPath: null`.
//
// File naming: put the PDF in the source folder as `<pack-id>.pdf`
// (e.g. `animal-kingdom.pdf`). A unique title match is also accepted.
//
// Usage:
//   node scripts/upload-missing-pack-pdfs.mjs            (dry run)
//   node scripts/upload-missing-pack-pdfs.mjs --apply    (upload + patch data/site.ts)

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const dirArg = args.find((arg) => arg.startsWith("--dir="));
const SOURCE_DIR = dirArg
    ? dirArg.slice("--dir=".length)
    : "C:\\Users\\josiph\\Desktop\\Pitanja";
const BUCKET = process.env.PACK_STORAGE_BUCKET || "pack-pdfs";

function loadEnv(path) {
    const env = {};

    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);

        if (!match) {
            continue;
        }

        env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
    }

    return env;
}

function normalize(value) {
    return value
        .toLowerCase()
        .replace(/\.pdf$/i, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

const raw = readFileSync("data/site.ts", "utf8");
const parts = raw.split(/(\r?\n {4}\{\r?\n {8}id: "[^"]+",)/);

const packs = [];

for (let index = 1; index < parts.length; index += 2) {
    const marker = parts[index];
    const body = parts[index + 1] ?? "";
    const id = marker.match(/id: "([^"]+)"/)?.[1] ?? "";
    const title = body.match(/title: "([^"]+)"/)?.[1] ?? "";
    const hasCategory = /categoryLabel: "/.test(body);
    const pdfPath = body.match(/pdfPath: ("[^"]+"|null)/)?.[1] ?? "null";

    packs.push({ id, title, hasCategory, pdfPath, body, index });
}

const missing = packs.filter(
    (pack) => pack.hasCategory && pack.title && pack.pdfPath === "null"
);

const files = readdirSync(SOURCE_DIR).filter((name) =>
    name.toLowerCase().endsWith(".pdf")
);

console.log(`Source folder: ${SOURCE_DIR}`);
console.log(`Packs without PDF: ${missing.length}`);
console.log(`PDF files available: ${files.length}`);
console.log(apply ? "MODE: APPLY (uploads + patch)\n" : "MODE: dry run\n");

if (!apply) {
    console.log(
        "Run with --apply to upload and patch, or see MISSING-PDFS.md for the checklist.\n"
    );
}

const env = apply ? loadEnv(".env.local") : null;
const supabase =
    env && env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
        ? createClient(
              env.NEXT_PUBLIC_SUPABASE_URL,
              env.SUPABASE_SERVICE_ROLE_KEY,
              { auth: { persistSession: false } }
          )
        : null;

const usedFiles = new Set();
const plan = [];

for (const pack of missing) {
    const exact = files.find(
        (name) => normalize(name) === normalize(pack.id)
    );
    const byTitle = files.find(
        (name) =>
            !usedFiles.has(name) && normalize(name) === normalize(pack.title)
    );
    const file = exact ?? byTitle ?? null;

    if (file) {
        usedFiles.add(file);
    }

    plan.push({ pack, file });
    console.log(
        `${file ? "OK " : "-- "} ${pack.id.padEnd(30)} ${file ?? "(missing file)"}`
    );
}

if (!apply) {
    const ready = plan.filter((row) => row.file).length;
    console.log(`\nReady to upload: ${ready}/${plan.length}`);
    process.exit(0);
}

if (!supabase) {
    console.error("Missing Supabase env in .env.local");
    process.exit(1);
}

const { data: buckets, error: bucketsError } =
    await supabase.storage.listBuckets();

if (bucketsError) {
    console.error("Cannot list buckets:", bucketsError.message);
    process.exit(1);
}

if (!buckets.some((bucket) => bucket.name === BUCKET)) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
        public: false
    });

    if (error) {
        console.error(`Cannot create bucket ${BUCKET}:`, error.message);
        process.exit(1);
    }
}

let uploaded = 0;

for (const { pack, file } of plan) {
    if (!file) {
        continue;
    }

    const objectName = `${pack.id}.pdf`;
    const bytes = readFileSync(`${SOURCE_DIR}\\${file}`);

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(objectName, bytes, {
            contentType: "application/pdf",
            upsert: true
        });

    if (error) {
        console.error(`FAILED ${pack.id}: ${error.message}`);
        continue;
    }

    pack.body = pack.body.replace(
        /pdfPath: null/,
        `pdfPath: "/packs/${objectName}"`
    );
    parts[pack.index + 1] = pack.body;
    uploaded += 1;
    console.log(`uploaded ${objectName} (${bytes.length} bytes)`);
}

if (uploaded > 0) {
    writeFileSync("data/site.ts", parts.join(""));
    console.log(`\nPatched data/site.ts for ${uploaded} pack(s).`);
}

const skipped = plan.filter((row) => !row.file).map((row) => row.pack.id);

if (skipped.length) {
    console.log(`\nStill missing PDF (${skipped.length}):`);
    for (const id of skipped) {
        console.log(` - ${id}`);
    }
}

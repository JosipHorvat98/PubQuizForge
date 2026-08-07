// file: scripts/test-pack-downloads.mjs
// End-to-end smoke test for the private pack-download chain.
//
// Verifies (for every pack that declares a pdfPath):
//   1. the object exists in the pack-pdfs bucket,
//   2. a signed URL can be created with the service-role key,
//   3. the signed URL actually responds with application/pdf (HTTP 200).
//
// Credentials come from .env.local (the same file the Next app uses).
//
// Usage:
//   node scripts/test-pack-downloads.mjs

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// --- Minimal .env.local parser (name=value lines, quotes stripped) ----------
function loadEnvLocal() {
  const envPath = join(root, ".env.local");
  const out = {};

  if (!existsSync(envPath)) {
    return out;
  }

  for (const rawLine of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const eq = line.indexOf("=");

    if (eq === -1) {
      continue;
    }

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    out[key] = value;
  }

  return out;
}

// --- Load the exact packs list used by the app ------------------------------
async function loadPacks() {
  // data/site.ts is TypeScript; pull the { id, pdfPath } pairs without a build.
  // Each pack is an object that starts with `id: "..."`; split on that token so
  // every following block is one entry, then read its pdfPath (if any).
  const tsPath = join(root, "data", "site.ts");
  const text = readFileSync(tsPath, "utf8");

  const blocks = text.split(/\bid:\s*"/).slice(1);
  const packs = blocks
    .map((block) => {
      const id = block.slice(0, block.indexOf('"'));
      const pdfMatch = block.match(/\bpdfPath:\s*(null|"([^"]+)")/);
      // group 2 holds the path without quotes; group 1 may include them.
      const pdfRaw = pdfMatch ? (pdfMatch[2] ?? pdfMatch[1]) : "null";
      const pdfPath = pdfRaw === "null" || !pdfRaw ? null : pdfRaw;
      return { id, pdfPath };
    })
    .filter((p) => p.pdfPath);

  return packs;
}

function objectNameFromPdfPath(pdfPath) {
  return pdfPath.split("/").pop();
}

// --- Main -------------------------------------------------------------------
const env = { ...process.env, ...loadEnvLocal() };
const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = env.PACK_STORAGE_BUCKET || "pack-pdfs";

if (!url || !key) {
  console.error(
    "Missing Supabase credentials in .env.local (need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)."
  );
  process.exit(1);
}

const supabase = createClient(url, key);
const packsWithPdf = await loadPacks();

console.log(`Connecting to ${url} ...`);
console.log(`Bucket under test: "${bucket}"`);
console.log(`Packs that declare a PDF (${packsWithPdf.length}):`);
for (const p of packsWithPdf) {
  console.log(`  - ${p.id} -> ${p.pdfPath}`);
}
console.log("");

// 1) Bucket exists?
const { data: buckets, error: bucketError } =
  await supabase.storage.listBuckets();

if (bucketError) {
  console.error("Could not list buckets:", bucketError.message);
  process.exit(1);
}

if (!(buckets ?? []).some((b) => b.id === bucket)) {
  console.error(`Bucket "${bucket}" does not exist. Run scripts/upload-packs.mjs first.`);
  process.exit(1);
}

console.log(`OK: bucket "${bucket}" exists.`);

// 2) What's actually in the bucket?
const { data: objects, error: objectsError } = await supabase.storage
  .from(bucket)
  .list();

if (objectsError) {
  console.error("Could not list bucket contents:", objectsError.message);
  process.exit(1);
}

const objectNames = new Set((objects ?? []).map((o) => o.name));
console.log(
  `Bucket contains ${objects?.length ?? 0} object(s): ${
    (objects ?? []).map((o) => o.name).join(", ") || "(empty)"
  }`
);
console.log("");

// 3) For each declared PDF: exists? signed URL? reachable?
let failures = 0;

for (const pack of packsWithPdf) {
  const objectName = objectNameFromPdfPath(pack.pdfPath);

  if (!objectNames.has(objectName)) {
    console.error(`FAIL  ${pack.id}: "${objectName}" is NOT in the bucket.`);
    failures += 1;
    continue;
  }

  const { data: signedData, error: signedError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(objectName, 3600);

  if (signedError || !signedData?.signedUrl) {
    console.error(
      `FAIL  ${pack.id}: could not create signed URL -> ${signedError?.message ?? "empty response"}`
    );
    failures += 1;
    continue;
  }

  // Actually hit the signed URL.
  try {
    const response = await fetch(signedData.signedUrl, { redirect: "follow" });
    const contentType = response.headers.get("content-type") ?? "";
    const ok = response.status === 200 && contentType.includes("application/pdf");

    if (ok) {
      console.log(`PASS  ${pack.id}: signed URL -> HTTP ${response.status} (${contentType})`);
    } else {
      console.error(
        `FAIL  ${pack.id}: signed URL responded HTTP ${response.status}, content-type "${contentType}"`
      );
      failures += 1;
    }
  } catch (error) {
    console.error(`FAIL  ${pack.id}: could not fetch signed URL -> ${error.message}`);
    failures += 1;
  }
}

console.log("");
console.log(failures === 0 ? "ALL CHECKS PASSED." : `${failures} check(s) FAILED.`);

if (failures > 0) {
  process.exit(1);
}

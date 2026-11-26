// file: scripts/report-missing-pdfs.mjs
// Read-only report: lists packs without a PDF and tries to match them against
// PDF files in a source folder (default: C:\Users\josiph\Desktop\Pitanja).
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const SOURCE_DIR =
    process.argv[2] ?? "C:\\Users\\josiph\\Desktop\\Pitanja";

const source = readFileSync("data/site.ts", "utf8").replace(/\r\n/g, "\n");

// Split into pack blocks by the `id: "..."` marker.
const blocks = source.split(/\n    \{\n        id: "([^"]+)",/);

const packs = [];

for (let index = 1; index < blocks.length; index += 2) {
    const id = blocks[index];
    const body = blocks[index + 1] ?? "";
    const title = body.match(/title: "([^"]+)"/)?.[1] ?? "";
    const tier = body.match(/tier: "([^"]+)"/)?.[1] ?? "";
    const categoryLabel =
        body.match(/categoryLabel: "([^"]+)"/)?.[1] ?? "";
    const pdfPath = body.match(/pdfPath: ("[^"]+"|null)/)?.[1] ?? "null";

    packs.push({ id, title, tier, categoryLabel, pdfPath });
}

function normalize(value) {
    return value
        .toLowerCase()
        .replace(/\.pdf$/i, "")
        .replace(/pubquizforge/g, " ")
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function tokens(value) {
    return new Set(normalize(value).split(" ").filter(Boolean));
}

function score(packTitle, fileName) {
    const packTokens = tokens(packTitle);
    const fileTokens = tokens(fileName);

    if (packTokens.size === 0) {
        return 0;
    }

    let hits = 0;

    for (const token of packTokens) {
        if (fileTokens.has(token)) {
            hits += 1;
        }
    }

    return hits / packTokens.size;
}

const files = readdirSync(SOURCE_DIR).filter((name) =>
    name.toLowerCase().endsWith(".pdf")
);

const missing = packs
    .filter((pack) => pack.title && pack.categoryLabel)
    .filter((pack) => pack.pdfPath === "null");
const withPdf = packs
    .filter((pack) => pack.title && pack.categoryLabel)
    .filter((pack) => pack.pdfPath !== "null");
const realPacks = [...withPdf, ...missing];

console.log(`Packs total: ${realPacks.length}`);
console.log(`With PDF: ${withPdf.length}`);
console.log(`Without PDF: ${missing.length}`);
console.log(`PDF files in source folder: ${files.length}\n`);

console.log("--- Missing packs ---");

const report = [];

for (const pack of missing) {
    let best = { fileName: null, score: 0 };

    for (const fileName of files) {
        if (alreadyUsed.has(normalize(fileName))) {
            continue;
        }

        const candidate = score(pack.title, fileName);

        if (candidate > best.score) {
            best = { fileName, score: candidate };
        }
    }

    const match =
        best.fileName && best.score >= 0.9 ? best.fileName : null;

    report.push({
        id: pack.id,
        title: pack.title,
        tier: pack.tier,
        category: pack.categoryLabel,
        suggestedFile: `${pack.id}.pdf`,
        sourceMatch: match,
        score: Number(best.score.toFixed(2))
    });

    console.log(
        [
            pack.id.padEnd(28),
            pack.title.padEnd(34),
            `${pack.tier}/${pack.categoryLabel}`.padEnd(22),
            match
                ? `MATCH: ${match} (${best.score.toFixed(2)})`
                : "no file yet"
        ].join(" | ")
    );
}

console.log("\n--- Files in folder not matching any pack that already has a PDF ---");

for (const fileName of files) {
    const matchesKnownPack = withPdf.some(
        (pack) => score(pack.title, fileName) >= 0.8
    );

    if (!matchesKnownPack) {
        console.log(fileName);
    }
}

writeFileSync(
    "missing-pdfs.json",
    JSON.stringify({ generatedAt: new Date().toISOString(), report }, null, 2)
);

const markdown = [
    "# Missing pack PDFs",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `Missing PDFs: **${report.length}** of ${realPacks.length} packs.`,
    "",
    "Name each file exactly `<pack-id>.pdf` (third column), drop it into this",
    "folder, then run from the project root:",
    "",
    "```powershell",
    "node scripts/upload-missing-pack-pdfs.mjs",
    "node scripts/upload-missing-pack-pdfs.mjs --apply",
    "```",
    "",
    "| # | Pack ID | Title | Tier | Category | File to create |",
    "|---|---|---|---|---|---|",
    ...report.map(
        (row, index) =>
            `| ${index + 1} | \`${row.id}\` | ${row.title} | ${row.tier} | ${row.category} | \`${row.suggestedFile}\` |`
    )
].join("\n");

writeFileSync(`${SOURCE_DIR}\\MISSING-PDFS.md`, markdown);

console.log(`\nWrote ${SOURCE_DIR}\\MISSING-PDFS.md`);

console.log("\nWrote missing-pdfs.json");

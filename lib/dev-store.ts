// file: lib/dev-store.ts
import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredDownload = {
    id: string;
    title: string;
    email: string;
    type: "pack" | "membership";
    createdAt: string;
};

const dataDir = path.join(process.cwd(), "tmp");
const filePath = path.join(dataDir, "downloads.json");

async function ensureStore() {
    await mkdir(dataDir, { recursive: true });
    try {
        await readFile(filePath, "utf8");
    } catch {
        await writeFile(filePath, "[]", "utf8");
    }
}

export async function readDownloads() {
    await ensureStore();
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as StoredDownload[];
}

export async function writeDownloads(downloads: StoredDownload[]) {
    await ensureStore();
    await writeFile(filePath, JSON.stringify(downloads, null, 2), "utf8");
}

export async function addDownloads(entries: StoredDownload[]) {
    const current = await readDownloads();
    await writeDownloads([...current, ...entries]);
}

export async function getDownloadsByEmail(email: string) {
    const current = await readDownloads();
    return current.filter((entry) => entry.email.toLowerCase() === email.toLowerCase());
}

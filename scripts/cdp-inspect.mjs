// file: scripts/cdp-inspect.mjs
// Launch headless Chrome, open the app, capture console + runtime errors.
// Usage: node scripts/cdp-inspect.mjs <url>
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const url = process.argv[2] ?? "http://localhost:3000";
const chrome =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const profile = mkdtempSync(join(tmpdir(), "cdp-"));
const port = 9333;

const proc = spawn(chrome, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "--no-first-run",
  "--disable-gpu",
  "--window-size=1280,1000",
  "about:blank"
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForCdp() {
  for (let i = 0; i < 40; i++) {
    try {
      const resp = await fetch(`http://localhost:${port}/json/version`);
      if (resp.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error("CDP not reachable");
}

async function main() {
  await waitForCdp();

  const targets = await (await fetch(`http://localhost:${port}/json/list`)).json();
  const page = targets.find((t) => t.type === "page");

  if (!page?.webSocketDebuggerUrl) {
    throw new Error("No page target");
  }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let idCounter = 1;
  const pending = new Map();

  const call = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });

  const events = [];

  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data.toString());
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      return;
    }

    if (msg.method === "Runtime.exceptionThrown") {
      const d = msg.params.exceptionDetails;
      events.push({ kind: "EXCEPTION", text: (d.exception?.description || d.text || "").slice(0, 1500) });
    }

    if (msg.method === "Runtime.consoleAPICalled") {
      const args = (msg.params.args || [])
        .map((a) => (a.value !== undefined ? String(a.value) : a.description || ""))
        .join(" ");
      if (msg.params.type === "error" || msg.params.type === "warning") {
        events.push({ kind: msg.params.type.toUpperCase(), text: args.slice(0, 1500) });
      }
    }

    if (msg.method === "Log.entryAdded") {
      if (msg.params.entry?.level === "error" || msg.params.entry?.level === "warning") {
        events.push({ kind: msg.params.entry.level.toUpperCase(), text: (msg.params.entry.text || "").slice(0, 1500) });
      }
    }
  });

  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });

  await call("Runtime.enable");
  await call("Page.enable");
  await call("Log.enable");
  await call("Console.enable");
  await call("Runtime.releaseObjectGroup", { objectGroup: "console" });

  await call("Page.navigate", { url });
  await sleep(14000);

  // Inspect reactivity: count client components / check if JS hydrated.
  const evalResult = await call("Runtime.evaluate", {
    expression: `(() => {
      const cart = [...document.querySelectorAll('a[href="/cart"],button')].length;
      const version = (window.next && window.next.version) || 'n/a';
      const hasOverlay = !!document.querySelector('nextjs-portal, [data-nextjs-dialog-overlay]');
      return JSON.stringify({ scriptCount: document.scripts.length, buttonsLinks: cart, nextVersion: version, devOverlay: hasOverlay });
    })()`,
    returnByValue: true
  });

  console.log("PAGE STATE:", evalResult?.result?.value);
  console.log("");
  console.log("=== EVENTS (" + events.length + ") ===");
  if (events.length === 0) {
    console.log("(none)");
  }
  for (const e of events) {
    console.log(`--- ${e.kind} ---\n${e.text}\n`);
  }

  ws.close();
  proc.kill();
  process.exit(events.some((e) => e.kind === "EXCEPTION" || e.kind === "ERROR") ? 2 : 0);
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  proc.kill();
  process.exit(3);
});

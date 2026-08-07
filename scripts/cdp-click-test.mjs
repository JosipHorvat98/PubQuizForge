// file: scripts/cdp-click-test.mjs
// Headless Chrome interaction test: verifies that clicks actually work.
// Usage: node scripts/cdp-click-test.mjs
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const url = "http://localhost:3000";
const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const profile = mkdtempSync(join(tmpdir(), "cdp-click-"));
const port = 9334;

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
      events.push("EXCEPTION: " + (msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text || "").slice(0, 800));
    }
  });

  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });

  await call("Runtime.enable");
  await call("Page.enable");
  await call("Page.navigate", { url });
  await sleep(8000);

  const evaluate = async (expression) => {
    const r = await call("Runtime.evaluate", { expression, returnByValue: true });
    return r?.result?.value;
  };

  // 1) Baseline: how many product cards?
  const before = await evaluate(`document.querySelectorAll('article').length`);
  console.log(`Baseline: ${before} product <article> elements.`);

  // 2) Click the "TV & Film" category filter pill (label has an emoji prefix).
  await evaluate(`(() => {
    const buttons = [...document.querySelectorAll('button')];
    const pill = buttons.find((b) => b.textContent.includes('TV & Film'));
    if (!pill) return 'no pill found';
    pill.click();
    return 'clicked';
  })()`);
  await sleep(1500);
  const afterFilter = await evaluate(`document.querySelectorAll('article').length`);
  console.log(`After clicking "TV & Film" filter: ${afterFilter} <article> elements (was ${before}).`);
  const visibleTitles = await evaluate(`[...document.querySelectorAll('article h3')].map((h) => h.textContent.trim()).join(' | ')`);
  console.log(`Visible titles: ${visibleTitles}`);

  // 3) Click "Add to Cart" on the first pack card, then read the header cart count.
  await evaluate(`(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Add to Cart');
    if (!btn) return 'no add-to-cart button';
    btn.click();
    return 'clicked';
  })()`);
  await sleep(1500);
  const cartText = await evaluate(`document.querySelector('a[href="/cart"]')?.textContent.trim() ?? '(cart link not found)'`);
  console.log(`After clicking "Add to Cart", header cart shows: "${cartText}"`);

  // 4) Click the "View Pack" link on the first card and verify navigation.
  await evaluate(`(() => {
    const links = [...document.querySelectorAll('a[href^="/packs/"]')];
    // Pick the gold "View Pack" button rather than the image link.
    const viewPack = links.find((a) => a.textContent.trim() === 'View Pack');
    if (!viewPack) return 'no View Pack button';
    viewPack.click();
    return 'clicked';
  })()`);
  console.log("Waiting ~12s for /packs/[slug] (now warm)...");
  await sleep(12000);
  const location = await evaluate(`location.pathname`);
  const h1 = await evaluate(`document.querySelector('h1')?.textContent?.trim() ?? '(none)'`);
  console.log(`After clicking "View Pack": path = ${location}, h1 = "${h1}"`);

  console.log("");
  console.log("=== RUNTIME EVENTS ===");
  console.log(events.length ? events.join("\n") : "(none)");

  ws.close();
  proc.kill();
  process.exit(events.length ? 2 : 0);
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  proc.kill();
  process.exit(3);
});

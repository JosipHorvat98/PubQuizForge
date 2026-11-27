// file: scripts/check-live-stripe-config.mjs
// Read-only checks against the production site:
//  1. Which Stripe price IDs are baked into the client bundle.
//  2. Whether each price exists in the LOCAL (usually test) Stripe account.
//  3. Webhook endpoint status codes (www vs non-www redirect).
import { readFileSync } from "node:fs";
import Stripe from "stripe";

const BASE = "https://www.pubquizforge.com";

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

const html = await (await fetch(`${BASE}/memberships`)).text();
const chunks = [
    ...new Set(
        [...html.matchAll(/\/_next\/static\/[^"'\\ )]+\.js/g)].map(
            (match) => match[0]
        )
    )
];

const priceIds = new Set();

for (const chunk of chunks) {
    try {
        const js = await (await fetch(`${BASE}${chunk}`)).text();

        for (const match of js.matchAll(/price_[A-Za-z0-9]{10,}/g)) {
            if (!priceIds.has(match[0])) {
                priceIds.add(match[0]);

                const start = Math.max(0, (match.index ?? 0) - 140);
                const snippet = js.slice(start, (match.index ?? 0) + 40);

                console.log(
                    `Context: ...${snippet.replace(/\s+/g, " ")}...`
                );
            }
        }
    } catch {
        // ignore chunk failures
    }
}

console.log(`Chunks scanned: ${chunks.length}`);
console.log(`Price IDs in production bundle: ${priceIds.size}`);

const env = loadEnv(".env.local");
const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const localMode = env.STRIPE_SECRET_KEY?.startsWith("sk_live")
    ? "LIVE"
    : "TEST";

console.log(`Local Stripe key mode: ${localMode}\n`);

for (const priceId of priceIds) {
    try {
        const price = await stripe.prices.retrieve(priceId, {
            expand: ["product"]
        });
        const product = price.product;
        const productName =
            typeof product === "string"
                ? product
                : !product.deleted
                  ? product.name
                  : "(deleted)";

        console.log(
            `${priceId} | exists in ${localMode} | ${productName} | ${price.unit_amount} ${price.currency} | ${price.recurring?.interval ?? "one-off"} | active=${price.active}`
        );
    } catch (error) {
        console.log(
            `${priceId} | NOT in ${localMode} Stripe (live-only or deleted) | ${error.message}`
        );
    }
}

console.log("\n--- Webhook endpoint checks ---");

for (const url of [
    "https://pubquizforge.com/api/webhook",
    "https://www.pubquizforge.com/api/webhook"
]) {
    const response = await fetch(url, {
        method: "POST",
        redirect: "manual"
    });

    console.log(
        `${url} -> HTTP ${response.status} | location=${response.headers.get("location") ?? "-"}`
    );
}

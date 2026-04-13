// file: lib/checkout.ts
export type CheckoutPayload =
    | {
        mode: "payment";
        productName: string;
        unitAmount: number;
        quantity?: number;
        slug?: string;
    }
    | {
        mode: "payment";
        items: Array<{
            id: string;
            title: string;
            price: string;
            quantity: number;
        }>;
    }
    | {
        mode: "subscription";
        priceId: string;
        slug?: string;
    };

export async function startCheckout(payload: CheckoutPayload) {
    const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to start checkout");
    }

    window.location.href = data.url;
}
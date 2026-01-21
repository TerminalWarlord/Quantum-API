"use client";

import { useEffect, useState } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";

const PADDLE_ENV = process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox";
const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!;


export default function CheckoutPage({ priceId, authToken }: { priceId: string, authToken: string }) {
    const [paddle, setPaddle] = useState<Paddle | undefined>();
    const [loading, setLoading] = useState(true);

    // Initialize Paddle on mount
    useEffect(() => {
        let cancelled = false;

        async function init() {
            try {
                const instance = await initializePaddle({
                    environment: PADDLE_ENV as "sandbox" | "production",
                    token: PADDLE_CLIENT_TOKEN,
                });

                if (!cancelled) {
                    setPaddle(instance);
                }
            } catch (err) {
                console.error("Failed to initialize Paddle:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        init();

        return () => {
            cancelled = true;
        };
    }, []);

    const openCheckout = () => {
        if (!paddle) return;
        // const jwtToken = localStorage.getItem("token");
        // if (!jwtToken) {
        //     return;
        // }

        paddle.Checkout.open({
            items: [
                {
                    priceId,
                    quantity: 1,
                },
            ],
            settings: {
                displayMode: "overlay", // nice modal overlay
                successUrl: `${window.location.origin}/checkout/success`,
            },
            customData: {
                user_id: authToken
            }
        });
    };

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "1rem",
                fontFamily: "system-ui, sans-serif",
            }}
        >
            <h1>Paddle Checkout</h1>

            <button
                onClick={openCheckout}
                disabled={loading || !paddle}
                style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "999px",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "1rem",
                }}
            >
                {loading ? "Loading payment..." : "Buy / Subscribe"}
            </button>

            {!PADDLE_CLIENT_TOKEN && (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                    Missing NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
                </p>
            )}

            {!priceId && (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                    Missing NEXT_PUBLIC_PADDLE_PRICE_ID
                </p>
            )}
        </main>
    );
}
"use client";

import { IconCheck, IconCircleCheck } from "@tabler/icons-react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import useSWR from "swr"
import { BACKEND_URL } from "@/lib/config"
import { Plan } from "@repo/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";

const PADDLE_ENV = process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox";
const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!;



// const PLANS = [
//     {
//         "id": 2,
//         "api_id": 4,
//         "name": "Pro",
//         "monthly_requests": "10000",
//         "rate_limit": "1000",
//         "features": "This has many features....",
//         "price_in_cents": 500,
//         "price_id": "pri_01kf3jn5gcpea6m69d63bkzcs9",
//         "created_at": "2026-01-16 14:16:56.682415",
//         "updated_at": "2026-01-16 14:16:56.682415"
//     },
//     {
//         "id": 3,
//         "api_id": 4,
//         "name": "Enterprice",
//         "monthly_requests": "100000",
//         "rate_limit": "10000",
//         "features": "This has many features....",
//         "price_in_cents": 1475,
//         "price_id": "pri_01kf3jntvgt08pej0mwseymc7z",
//         "created_at": "2026-01-16 14:17:18.134895",
//         "updated_at": "2026-01-16 14:17:18.134895"
//     }
// ]


const fetcher = async (url: string) => {
    try {
        const res = await fetch(url);
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to fetch pricing");
        }
        return resData.results as Plan[];
    }
    catch (err: any) {
        toast.error(err.message || "Failed to fetch pricing");
        throw new Error(err.message || "Failed to fetch pricing");
    }
}

export default function Pricing({ api_slug, authToken }: { api_slug: string, authToken?: string }) {
    const { data, isLoading, error } = useSWR(`${BACKEND_URL}/plans?api_slug=${api_slug}`, fetcher);
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

    if (isLoading) {
        return <div className="flex w-full items-center justify-center min-h-5">
            <Loader2 className="animate-spin" />
        </div>
    }





    const openCheckout = (priceId: string) => {
        if (!paddle) return;
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
    return <div className="flex space-x-2 justify-center [&>:nth-child(2)_button]:bg-linear-to-br [&>:nth-child(2)_button]:from-cyan-400 [&>:nth-child(2)_button]:to-cyan-300 [&>:nth-child(2)_button]:text-white dark:[&>:nth-child(2)_button]:text-stone-800 flex-wrap space-y-4">
        {data != undefined && data.map(plan => {
            const roundedPrice = Math.floor(plan.price_in_cents / 100);
            const cents = Math.ceil((((plan.price_in_cents / 100) - Math.floor(plan.price_in_cents / 100)) * 100));
            return <Card className="min-w-64 p-4 h-fit gap-0 nth-[2]:border nth-[2]:border-cyan-400">
                <h4 className="text-lg font-medium">{plan.name}</h4>
                <p className="flex space-x-1 items-baseline py-2">
                    <span className="text-3xl font-semibold tracking-tighter"> {roundedPrice}</span>
                    <span className="text-stone-500 ">.{cents}/month</span>
                </p>
                <div className="text-sm tracking-tight text-stone-600 my-2 space-y-1">
                    <div className="flex space-x-1 items-center ">
                        <span><IconCircleCheck size={18} className="text-green-400" /></span>
                        <p>{plan.rate_limit} requests/hour</p>
                    </div>
                    <div className="flex space-x-1 items-center ">
                        <span><IconCircleCheck size={18} className="text-green-400" /></span>
                        <p>{plan.monthly_requests} requests/month</p>
                    </div>
                </div>
                <p className="text-sm my-1">{plan.features}</p>

                {/* <button
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
                </button> */}
                {authToken ? <Button
                    onClick={() => openCheckout(plan.price_id as string)}
                    disabled={!authToken || loading || !paddle}
                    className="my-3 nth-[2]:bg-amber-200"
                    variant={'outline'}>
                    Subscribe
                </Button> : <Button
                    className="my-3 nth-[2]:bg-amber-200"
                    variant={'outline'}>
                    <Link href={`/auth/login`}>
                        Subscribe
                    </Link>
                </Button>}

            </Card>
        })}
    </div>

}
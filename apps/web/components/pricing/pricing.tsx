"use client";

import { IconCheck, IconCircleCheck, IconStar, IconStarFilled } from "@tabler/icons-react"
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
import { createToken } from "@/lib/create_token";
import { cn } from "@/lib/utils";
import PricingCard from "./pricing_card";
import { useRouter } from "next/navigation";

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

export default function Pricing({ api_slug }: { api_slug: string }) {
    const { data, isLoading, error } = useSWR(`${BACKEND_URL}/plans?api_slug=${api_slug}`, fetcher);
    const [paddle, setPaddle] = useState<Paddle | undefined>();
    const [loading, setLoading] = useState(true);
    const session = useSession();
    const router = useRouter();
    // Initialize Paddle on mount
    useEffect(() => {
        if (!session || !session.data?.user.id) return;
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
    }, [session]);

    if (isLoading) {
        return <div className="flex w-full items-center justify-center min-h-5">
            <Loader2 className="animate-spin" />
        </div>
    }





    const openCheckout = async (priceId: string) => {
        try {
            if (!paddle) {
                throw new Error("Payment gateway not initialized yet!");
            }
            if (!session || !session.data?.user.id) {
                throw new Error("You must login to perform this operation");
            }
            paddle.Checkout.open({
                items: [
                    {
                        priceId,
                        quantity: 1,
                    },
                ],
                settings: {
                    displayMode: "overlay",
                    successUrl: `http://localhost:3000/dashboard/subscriptions`,
                },
                customData: {
                    user_id: await createToken(session.data)
                }
            });
        }
        catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            }
            else {
                toast.error("Failed to subscribe");
            }
        }
    };

    return <div className="flex space-x-2 justify-center flex-wrap space-y-4">
        {data != undefined && data.map(plan => {
            return <PricingCard plan={plan} key={plan.id}>
                {<Button
                    onClick={() => {
                        if (!session || !session.data?.user.id) {
                            router.push('/auth/login');
                            return;
                        }
                        openCheckout(plan.price_id as string);
                    }}
                    disabled={loading || !paddle}
                    className={cn(
                        "my-3",
                        plan.is_recommended ? "bg-cyan-400 hover:bg-cyan-400/80 text-white dark:bg-cyan-400 dark:hover:bg-cyan-400/80 hover:text-white" : ""
                    )}
                    variant={'outline'}>
                    Subscribe
                </Button>}
            </PricingCard>
        })}
    </div>

}
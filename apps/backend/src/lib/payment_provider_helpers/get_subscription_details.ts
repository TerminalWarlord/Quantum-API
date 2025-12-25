import { SubscriptionDataType } from "@repo/types";
import { BASE_URL } from "./paddle";

export const getSubscriptionDetails = async (subscription_id: string) => {
    const res = await fetch(`${BASE_URL}/subscriptions/${subscription_id}`);
    if (!res.ok) {
        return (await res.json()).data satisfies SubscriptionDataType;
    }
    throw new Error("Failed to fet subscription!");
}
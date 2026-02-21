import { signJwt } from "@/actions/auth";
import { BACKEND_URL } from "../config";
import { UserSubscription, UserSubscriptions } from "@repo/types";

export async function fetchUserSubscriptions(
    limit: number = 10,
    offset: number = 0,
    authToken: string,
    query?: string
) {
    const url = new URL(`${BACKEND_URL}/manage/subscriptions`);
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("offset", offset.toString());
    if (query) url.searchParams.append("query", query);
    const res = await fetch(url, {
        headers: {
            "Authorization": "Bearer " + authToken
        }
    });
    const resData = await res.json();
    if (!res.ok) {
        throw new Error(resData.error || resData.message || "Failed to fetch subscriptions");
    }
    return resData as {
        has_next_page: boolean,
        results: UserSubscription[]
    };
}
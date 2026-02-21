import { ReviewResponse } from "@repo/types";
import { BACKEND_URL } from "./config";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

export function createReviewStars(rating: number) {
    const filledInt = Math.ceil(rating);
    const remainingInt = 5 - filledInt;
    const filled = Array(filledInt).fill(null).map(() => IconStarFilled);
    const remaining = Array(remainingInt).fill(null).map(() => IconStar);
    return [filled, remaining];
}

export async function getReviews({ limit, offset, apiId, apiSlug }: {
    limit: number,
    offset: number,
    apiId?: number,
    apiSlug?: string,
}) {
    try {
        const url = new URL(`${BACKEND_URL}/reviews`);
        if (limit) url.searchParams.append('limit', limit.toString());
        if (offset) url.searchParams.append('offset', offset.toString());
        if (apiId) url.searchParams.append('api_id', apiId.toString());
        if (apiSlug) url.searchParams.append('api_slug', apiSlug.toString());

        const res = await fetch(url);
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to get reviews");
        }
        return resData as { results: ReviewResponse[], has_next_page: boolean };

    }
    catch (err) {
        throw new Error("Failed to get reviews");
    }

}
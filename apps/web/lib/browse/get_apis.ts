import { Api, ApiResult, SortBy, SortOrder } from "@repo/types";
import { BACKEND_URL } from "../config";

export async function fetchApis({
    categories,
    offset = 0,
    query = "",
    sort_by = SortBy.TITLE,
    user_id,
    sort_order = SortOrder.ASC,
    limit = 10
}:
    {
        categories?: string[],
        offset?: number,
        query?: string | null,
        sort_by?: SortBy,
        user_id?: number,
        sort_order?: SortOrder
        limit?: number
    }
) {
    const url = new URL(`${BACKEND_URL}/apis?offset=${offset}&limit=${limit}`);
    if (query) {
        url.searchParams.append('term', query);
    }
    if (user_id) {
        url.searchParams.append('user_id', user_id.toString());
    }
    if (sort_by) {
        url.searchParams.append('sort_by', sort_by);
    }
    if (sort_order) {
        url.searchParams.append('sort_order', sort_order.toLocaleUpperCase());
    }
    if (categories) {
        categories.forEach(category => {
            url.searchParams.append('category_slug', category);
        });
    }
    try {
        const res = await fetch(url);
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || "Failed to fetch APIs");
        }
        return resData as ApiResult;
    }
    catch (err) {
        console.log(err);
        throw new Error("Failed to fetch APIs");
    }

}
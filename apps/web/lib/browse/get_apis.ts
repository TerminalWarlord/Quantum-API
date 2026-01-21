import { Api, ApiResult } from "@repo/types";
import { BACKEND_URL } from "../config";

export async function fetchApis({
    categories,
    offset = 0,
    term = "",
    order_by_field,
    limit = 10
}:
    {
        categories: string[] | undefined,
        offset?: number,
        term?: string,
        order_by_field?: string,
        limit?: number
    }
) {
    const url = new URL(`${BACKEND_URL}/apis?offset=${offset}&limit=${limit}&order_by_field=PRICE`);
    if (term) {
        url.searchParams.append('term', term);
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
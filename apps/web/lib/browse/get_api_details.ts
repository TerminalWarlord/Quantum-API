import { Api } from "@repo/types";
import { BACKEND_URL } from "../config";

export async function fetchApiDetails(apiSlug: string) {
    try {
        const res = await fetch(`${BACKEND_URL}/api-details?api_slug=${apiSlug}`);
        const resData = await res.json();
        console.log(resData);
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to get API details");
        }
        return resData.results as Api;
    }
    catch (err: any) {
        console.log(err);
        throw new Error(err.message || "Failed to get API details!");
    }

}
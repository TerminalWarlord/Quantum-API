import { ReviewStatus } from "@repo/types";
import { BACKEND_URL } from "../config";


export async function updateReviewStatus(reviewId: string, token: string, status: ReviewStatus) {
    const res = await fetch(`${BACKEND_URL}/admin/moderate/review/${reviewId}`, {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        method: "PATCH",
        body: JSON.stringify({
            status
        })
    });
    if (!res.ok) {
        throw new Error("Failed to delete user");
    }
}

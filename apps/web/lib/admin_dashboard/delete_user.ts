import { BACKEND_URL } from "../config";


export async function deleteUserFetcher(userId: string, token: string) {
    const res = await fetch(`${BACKEND_URL}/admin/moderate/user/remove/${userId}`, {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        method: "DELETE"
    });
    if (!res.ok) {
        throw new Error("Failed to delete user");
    }
}

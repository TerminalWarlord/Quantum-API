import { FormEvent } from "react";
import { BACKEND_URL } from "../config";
import { Session } from "next-auth";
import { toast } from "sonner";



export async function submitProfileUpdateForm(
    e: FormEvent<HTMLFormElement>,
    session: Session | null,
    updateLoadingStatus: (status: boolean) => void
) {
    e.preventDefault();
    try {
        if (!session || !session.user.id) {
            throw new Error("Not logged in!");
        }
        updateLoadingStatus(true);
        const formData = new FormData(e.currentTarget);
        const body = Object.fromEntries(formData.entries())
        const tokenRes = await fetch('/api/token', {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                id: session.user.id
            })
        });
        if (!tokenRes.ok) {
            throw new Error("Failed to generate token");
        }
        const { token } = await tokenRes.json();
        const res = await fetch(`${BACKEND_URL}/user/update`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to update data");
        }
    }
    catch (err: any) {
        toast.error(err.message || "Failed to update profile");
    }
    updateLoadingStatus(false);
}
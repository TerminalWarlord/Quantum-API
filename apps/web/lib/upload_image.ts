import { Session } from "next-auth";
import { BACKEND_URL } from "./config";
import { createToken } from "./create_token";

export async function uploadImage(file: File, session: Session | null) {
    const token = await createToken(session);
    const res = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contentType: file.type,
            fileName: file.name
        })
    });
    if (!res.ok) {
        throw new Error("Failed to generate upload signed URL");
    }
    const resData = await res.json();
    console.log
    const bucketPathRes = await fetch(resData.upload_url, {
        method: "PUT",
        body: file
    });
    if (!bucketPathRes.ok) {
        throw new Error("Failed to upload file");
    }
    const viewableImageRes = await fetch(`${BACKEND_URL}/image`, {
        method: "POST",
        body: JSON.stringify({
            image_path: resData.path
        })
    });
    const { image_url } = await viewableImageRes.json();
    return { image_url, path: resData.path };
}
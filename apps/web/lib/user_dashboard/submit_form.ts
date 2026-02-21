import { Session } from "next-auth";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { FormEvent } from "react";
import { createToken } from "../create_token";



export async function submitForm(
    body: { [k: string]: string | boolean | number | undefined },
    session: Session | null,
    url: string,
    method: string = "POST"
) {
    try {
        // if (!session || !session.user.id) {
        //     throw new Error("Not logged in!");
        // }
        // const tokenRes = await fetch('/api/token', {
        //     method: "POST",
        //     credentials: "include",
        //     body: JSON.stringify({
        //         id: session.user.id
        //     })
        // });
        // if (!tokenRes.ok) {
        //     throw new Error("Failed to generate token");
        // }
        // const { token } = await tokenRes.json();
        const token = await createToken(session);
        const res = await fetch(url, {
            method,
            body: JSON.stringify(body),
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to submit data");
        }
        return resData;
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        throw new Error("Failed to submit data");
    }
}
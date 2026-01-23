"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BACKEND_URL } from "@/lib/config";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function getSubscriptions(api_slug: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
        throw new Error("Not logged in");
    }
    try {
        const res = await fetch(`${BACKEND_URL}/manage/keys?api_slug=${api_slug}`, {
            headers: {
                "Authorization": `Bearer ${jwt.sign({ id: session.user.id }, JWT_SECRET)}`
            }
        });
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to fetch subscriptions");
        }
        console.log(resData, api_slug, session.user.id)
        return resData.results as { id: number, name: string };
    }
    catch (err: any) {
        throw new Error(err.message || "Failed to fetch subscriptions");
    }
}
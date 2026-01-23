"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function signJwt(obj: { [key: string]: unknown }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error("Not logged in");
    }
    const token = jwt.sign(obj, JWT_SECRET);
    return token;
}
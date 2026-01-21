import { Context, Next } from "hono";
import jwt from "jsonwebtoken";
import { db, sql } from "@repo/db/client"

export interface CustomContext extends Context {
    token?: {
        id: number
    }
}

const JWT_SECRET = process.env.JWT_SECRET || "";

export const adminMiddleware = async (c: CustomContext, next: Next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({
            message: "Missing bearer token",
        }, 401);
    }
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
        return c.json({
            message: "Missing bearer token",
        }, 401);
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { id: number };
        if (!payload || !payload.id) {
            return c.json({
                message: "Invalid valid token!",
            }, 401);
        }
        const users = await db.execute(sql`
            SELECT
                id,
                role
            FROM
                users
            WHERE ${payload.id}=id
            LIMIT 1;
        `)
        if (!users || !users.rowCount || users.rows[0].role !== "ADMIN") {
            return c.json({
                message: "Unauthorized!",
            }, 401);
        }
        c.token = payload;
        await next();
    }
    catch (err) {
        return c.json({
            message: "Invalid valid token!",
        }, 401);
    }
}

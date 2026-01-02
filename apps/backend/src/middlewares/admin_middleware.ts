import { Context } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import jwt from "jsonwebtoken";
import { db, userTable } from "@repo/db/client"
import { eq } from "drizzle-orm";

export interface CustomContext extends Context {
    token?: {
        id: number
    }
}

const JWT_SECRET = process.env.JWT_SECRET || "";

export const adminMiddleware = bearerAuth({
    async verifyToken(token, c: CustomContext) {
        if (!token) return false;
        try {
            const payload = jwt.verify(token, JWT_SECRET) as { id: number };
            if (!payload || !payload.id) {
                return false;
            }
            const [user] = await db.select({ id: userTable.id, role: userTable.role })
                .from(userTable)
                .where(eq(userTable.id, payload.id));
            if (!user || user.role !== "ADMIN") {
                return false;
            }
            c.token = payload;
            return true;
        }
        catch (err) {
            console.log(token);
        }
        return false;
    },
})
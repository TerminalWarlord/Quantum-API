import * as z from "zod";
import { createSlug } from "../../lib/create_slug";
import { db, userTable } from "@repo/db/client";
import { CustomContext } from "../../middlewares/middleware";
import { eq } from "drizzle-orm";

export const postCreateCategory = async (c: CustomContext) => {
    const schema = z.object({
        name: z.string().min(3).max(30)
    });
    const parsedData = schema.safeParse(await c.req.json());
    if (!parsedData.success) {
        return c.json({
            message: "Failed to create category!",
            error: parsedData.error.flatten().fieldErrors
        }, 400);
    }
    const userId = c.token;
    if (!userId || !userId.id) {
        return c.json({
            message: "Unauthorized"
        }, 401);
    }
    const [user] = await db.select({ role: userTable.role })
        .from(userTable)
        .where(eq(userTable.id, userId.id))
        .limit(1);
    if (!user || !user.role || user.role !== "ADMIN") {
        return c.json({
            message: "Forbidden"
        }, 403);
    }
    return c.json({
        message: "Successful",
        name: parsedData.data.name,
        ...await createSlug(parsedData.data.name)
    });
}
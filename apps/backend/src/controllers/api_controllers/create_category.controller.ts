import * as z from "zod";
import { createSlug, tableEnum } from "../../lib/create_slug";
import { categoriesTable, db, userTable } from "@repo/db/client";
import { CustomContext } from "../../middlewares/user_middleware";
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
    const { slug } = await createSlug(parsedData.data.name, tableEnum.CATEGORIES);
    const [category] = await db.insert(categoriesTable).values({
        slug,
        name: parsedData.data.name,
    }).returning({ id: categoriesTable.id, slug: categoriesTable.slug, name: categoriesTable.name });
    if (!category) {
        return c.json({
            message: "Failed to create category"
        }, 409);
    }
    return c.json({
        message: "Successfully created category",
        ...category
    }, 201);
}
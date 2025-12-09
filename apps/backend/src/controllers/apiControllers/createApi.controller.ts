import { Context } from "hono";
import { db, apiTable } from "@repo/db/client";
import * as z from "zod";
import { CustomContext } from "../../middlewares/middleware";

export const postCreateApi = async (c: CustomContext) => {
    if (!c.token || !c.token.id) {
        return c.json({
            message: "Unauthorized"
        }, 401);
    }
    const schema = z.object({
        title: z.string().max(255).min(5),
        slug: z.string().max(255).min(5),
        description: z.string().min(10)
    });

    const parseData = schema.safeParse(await c.req.json());
    if (!parseData.success) {
        return c.json({
            message: "Failed to add API",
            error: parseData.error.flatten().fieldErrors
        }, 401);
    }
    try {
        await db.insert(apiTable).values({
            ...parseData.data,
            developer_id: c.token?.id
        });
        return c.json({
            message: "API has been created"
        })
    }
    catch (err) {
        console.log(err);
        return c.json({
            message: "Failed to create API"
        }, 501);
    }
}
import { db, apiTable } from "@repo/db/client";
import * as z from "zod";
import { CustomContext } from "../../middlewares/middleware";
import { createProduct } from "../../lib/paddle";

export const postCreateApi = async (c: CustomContext) => {
    if (!c.token || !c.token.id) {
        return c.json({
            message: "Unauthorized"
        }, 401);
    }
    const schema = z.object({
        title: z.string().max(255).min(5),
        slug: z.string().max(255).min(5),
        description: z.string().min(10),
        image_url: z.string().optional(),
        base_url: z.string().min(7).max(255),
        category_id: z.number(),
    });

    const parseData = schema.safeParse(await c.req.json());
    if (!parseData.success) {
        return c.json({
            message: "Failed to add API",
            error: parseData.error.flatten().fieldErrors
        }, 401);
    }
    try {
        const product_id = await createProduct({
            name: parseData.data.title,
            description: parseData.data.description,
            image_url: parseData.data.image_url
        })
        const [api] = await db.insert(apiTable).values({
            ...parseData.data,
            product_id,
            developer_id: c.token?.id,
        }).returning({ id: apiTable.id });
        if (!api) {
            return c.json({
                message: "Failed to create API",
            }, 501);
        }
        return c.json({
            message: "API has been created",
            api_id: api.id
        })
    }
    catch (err) {
        console.log(err);
        return c.json({
            message: "Failed to create API"
        }, 501);
    }
}
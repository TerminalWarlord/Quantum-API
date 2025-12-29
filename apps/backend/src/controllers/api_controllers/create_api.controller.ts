import { db, apiTable } from "@repo/db/client";
import * as z from "zod";
import { CustomContext } from "../../middlewares/middleware";
import { createProduct } from "../../lib/payment_provider_helpers/paddle";
import { createSlug, tableEnum } from "../../lib/create_slug";

export const postCreateApi = async (c: CustomContext) => {
    if (!c.token || !c.token.id) {
        return c.json({
            message: "Unauthorized"
        }, 401);
    }
    const schema = z.object({
        title: z.string().max(255).min(5),
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
        }, 400);
    }
    const { slug } = await createSlug(parseData.data.title, tableEnum.APIS);
    try {
        const product_id = await createProduct({
            name: parseData.data.title,
            description: parseData.data.description,
            image_url: parseData.data.image_url
        })
        const [api] = await db.insert(apiTable).values({
            ...parseData.data,
            slug,
            product_id,
            thumbnail_url: parseData.data.image_url,
            developer_id: c.token?.id,
        }).returning({ id: apiTable.id });
        if (!api) {
            return c.json({
                message: "Failed to create API",
            }, 409);
        }
        return c.json({
            message: "API has been created",
            api_id: api.id
        }, 201)
    }
    catch (err) {
        console.log(err);
        return c.json({
            message: "Internal Server Error"
        }, 500);
    }
}
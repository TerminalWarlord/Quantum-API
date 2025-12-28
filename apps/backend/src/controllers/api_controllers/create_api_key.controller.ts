import { apiKeyTable, db } from "@repo/db/client";
import { Context } from "hono";
import * as z from "zod";
import { createApiHash } from "../../lib/create_api_hash";

export const postCreateApiKey = async (c: Context) => {
    const schema = z.object({
        subscription_id: z.coerce.number()
    });

    const parsedData = schema.safeParse(await c.req.json());
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input",
            error: parsedData.error.flatten().fieldErrors
        }, 400);
    }
    try {
        const { apiKey, apiKeyHash } = createApiHash();
        const [apiKeyItem] = await db.insert(apiKeyTable).values({
            subscription_id: parsedData.data.subscription_id,
            key_hash: apiKeyHash
        }).returning();
        if (!apiKeyItem) {
            return c.json({
                message: "Failed to create API KEY"
            }, 409);
        }
        return c.json({
            message: "Successfully created API KEY",
            apiKey,
        }, 201);
    }
    catch (err) {
        return c.json({
            message: "Internal Server Error",
        }, 500);
    }
}
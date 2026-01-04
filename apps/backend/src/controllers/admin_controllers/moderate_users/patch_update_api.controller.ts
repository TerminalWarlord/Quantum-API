import { apiTable, db } from "@repo/db/client";
import { Context } from "hono";
import * as z from "zod";
import { eq } from "drizzle-orm";
import { ApiStatus } from "@repo/types";

export const patchUpdateApi = async (c: Context) => {
    const schema = z.object({
        api_id: z.coerce.number(),
        status: z.enum(ApiStatus)
    });
    let body;
    try {
        body = await c.req.json();
    }
    catch (err) {
        return c.json({
            error: "Request body must be valid JSON"
        }, 400);
    }
    const parsedData = schema.safeParse({
        api_id: c.req.param('api_id'),
        status: body?.status
    });
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input",
            error: parsedData.error.flatten().fieldErrors
        }, 400);
    }

    try {
        const api = await db.update(apiTable)
            .set({
                status: parsedData.data.status
            })
            .where(eq(apiTable.id, parsedData.data.api_id))
            .returning({ id: apiTable.id });
        if (!api) {
            return c.json({
                message: "API not found!",
            }, 404);
        }
        return c.json({
            message: "API status has been updated",
        });

    }
    catch (err) {
        return c.json({
            message: "Internal Server Error",
        }, 500);
    }
}
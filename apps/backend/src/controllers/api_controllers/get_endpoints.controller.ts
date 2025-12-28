import { Context } from "hono";
import { eq } from "drizzle-orm";
import { db, endpointTable } from "@repo/db/client";
import * as z from "zod";

export const getEndpoints = async (c: Context) => {
    const schema = z.object({
        api_id: z.coerce.number()
    });
    const parsedData = schema.safeParse({
        api_id: c.req.query('api_id')
    });
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input",
            error: parsedData.error.flatten().fieldErrors
        }, 403);
    }
    console.log(parsedData.data)

    try {
        const endpoints = await db
            .select()
            .from(endpointTable)
            .where(eq(endpointTable.api_id, parsedData.data.api_id));

        if (!endpoints) {
            return c.json({
                message: "Not found"
            }, 404);
        }
        return c.json({
            result: endpoints
        });
    }
    catch (err) {
        return c.json({
            message: "Something went wrong!",
        }, 500);
    }
}
import { Context } from "hono";
import { eq } from "drizzle-orm";
import { db, parameterTable } from "@repo/db/client";
import * as z from "zod";

export const getParameters = async (c: Context) => {
    const schema = z.object({
        endpoint_id: z.coerce.number()
    });
    const parsedData = schema.safeParse({
        endpoint_id: c.req.query('endpoint_id')
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
            .from(parameterTable)
            .where(eq(parameterTable.endpoint_id, parsedData.data.endpoint_id));

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
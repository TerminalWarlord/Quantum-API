import { Context } from "hono";
import { db, endpointTable, eq, sql } from "@repo/db/client";
import * as z from "zod";
import { Endpoint } from "@/packages/types/core/endpoint";

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
        const { api_id } = parsedData.data;
        // const endpoints = await db
        //     .select()
        //     .from(endpointTable)
        //     .where(eq(endpointTable.api_id, api_id));
        const results = await db.execute(sql`
            SELECT
                *
            FROM endpoints
            WHERE api_id=${api_id};
        `)
        if (!results) {
            return c.json({
                message: "Not found"
            }, 404);
        }
        return c.json({
            results: results.rows as unknown as Endpoint[]
        });
    }
    catch (err) {
        return c.json({
            message: "Something went wrong!",
        }, 500);
    }
}
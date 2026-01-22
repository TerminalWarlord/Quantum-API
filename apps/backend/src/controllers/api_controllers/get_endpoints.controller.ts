import { Context } from "hono";
import { db, endpointTable, eq, sql } from "@repo/db/client";
import * as z from "zod";
import { Endpoint, EndpointResponse } from "@/packages/types/core/endpoint";

export const getEndpoints = async (c: Context) => {
    const schema = z.object({
        api_slug: z.coerce.string()
    });
    const parsedData = schema.safeParse({
        api_slug: c.req.query('api_slug')
    });
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input",
            error: parsedData.error.flatten().fieldErrors
        }, 403);
    }
    console.log(parsedData.data)

    try {
        const { api_slug } = parsedData.data;
        // const endpoints = await db
        //     .select()
        //     .from(endpointTable)
        //     .where(eq(endpointTable.api_id, api_id));
        const results = await db.execute(sql`
            SELECT
                e.id,
                path,
                e.title,
                e.description,
                e.method
            FROM endpoints e
            JOIN apis a
                ON a.id=e.api_id
            WHERE a.slug=${api_slug};
        `)
        if (!results) {
            return c.json({
                message: "Not found"
            }, 404);
        }
        return c.json({
            results: results.rows as unknown as EndpointResponse[]
        });
    }
    catch (err) {
        console.log(err)
        return c.json({
            message: "Something went wrong!",
        }, 500);
    }
}
import { Context } from "hono";
import { eq } from "drizzle-orm";
import { db, parameterTable, sql } from "@repo/db/client";
import * as z from "zod";
import { Parameter } from "@/packages/types";

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
        const { endpoint_id } = parsedData.data;

        // const endpoints = await db
        //     .select()
        //     .from(parameterTable)
        //     .where(eq(parameterTable.endpoint_id, parsedData.data.endpoint_id));
        const paramResults = await db.execute(sql`
            SELECT
                id,
                endpoint_id,
                name,
                location,
                is_required,
                default_value,
                type
            FROM parameters
            WHERE endpoint_id=${parsedData.data.endpoint_id};
        `)
        const endpointResults = await db.execute(sql`
            SELECT
                path,
                title,
                description,
                method,
                sample_response
            FROM endpoints
            WHERE id=${endpoint_id}
            LIMIT 1;
        `)
        if (!paramResults && !endpointResults) {
            return c.json({
                message: "Not found"
            }, 404);
        }
        return c.json({
            ...endpointResults.rows[0],
            results: paramResults.rows as unknown as Parameter[]
        });
    }
    catch (err) {
        return c.json({
            message: "Something went wrong!",
        }, 500);
    }
}
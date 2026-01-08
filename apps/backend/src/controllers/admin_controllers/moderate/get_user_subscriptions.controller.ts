import { Context } from "hono";
import * as z from "zod";
import { db, sql } from "@repo/db/client";

export const getUserSubcriptions = async (c: Context) => {
    const schema = z.object({
        user_id: z.coerce.number(),
        limit: z.coerce.number().min(1).max(50).default(10),
        offset: z.coerce.number().max(0).default(0),
    })
    const parsedData = schema.safeParse(c.req.query());
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input",
            error: parsedData.error.flatten().fieldErrors
        }, 400);
    }
    const userId = parsedData.data.user_id;
    const result = await db.execute(sql`
        SELECT 
            s.current_period_start,
            s.current_period_end,
            a.title,
            a.id,
            a.slug,
            p.name,
            p.price_in_cents
        FROM ${sql.identifier('subscriptions')} AS s
        JOIN ${sql.identifier('plans')} AS p
            ON s.plan_id=p.id
        JOIN ${sql.identifier('apis')} AS a
            ON s.api_id=a.id
        WHERE
            ${sql`s.user_id=${userId}`}
            AND s.status='active'
        LIMIT ${parsedData.data.limit + 1}
        OFFSET ${parsedData.data.offset};
    `);
    return c.json({
        results: result.rows.slice(0, parsedData.data.limit),
        hasNextPage: result.rowCount && result.rowCount > parsedData.data.limit
    });

}
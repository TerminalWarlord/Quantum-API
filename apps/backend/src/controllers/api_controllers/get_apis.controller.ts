import { db } from "@repo/db/client";
import { Context } from "hono";
import { sql } from "drizzle-orm";
import * as z from "zod";
import { OrderByEnum } from "@repo/types";

export const getApis = async (c: Context) => {
    const schema = z.object({
        term: z.string().optional(),
        limit: z.coerce.number().min(1).max(50).default(10),
        offset: z.coerce.number().min(0).default(0),
        category_slug: z.string().optional(),
        order_by_field: z.enum(OrderByEnum).default(OrderByEnum.PUBLISHED),
        order_by: z.enum(["asc", "des"]).default("asc")
    })
    const parseData = schema.safeParse(c.req.query());
    if (!parseData.success) {
        return c.json({
            message: "Failed to query",
            error: parseData.error.flatten().fieldErrors,
        }, 400);
    }
    const { limit, offset, order_by, category_slug, order_by_field, term } = parseData.data;
    // TODO: Implement Ordering
    const apis = await db.execute(sql`
        SELECT a.title, a.slug, a.description, c.name AS category_name, c.slug as category_slug, a.thumbnail_url, a.updated_at  FROM apis AS a
        JOIN categories AS c
        ON c.id=a.category_id
        WHERE (
            ${term ? sql`a.title ILIKE ${'%' + term + '%'}` : sql`TRUE`}
            AND 
            ${category_slug ? sql`c.slug=${category_slug}` : sql`TRUE`}
            )
        LIMIT ${limit + 1}
        OFFSET ${offset}
    `)
    if (!apis || !apis.rowCount) {
        return c.json({
            message: "Nothing found"
        }, 404);
    }
    const hasNextPage = apis.rowCount > limit;
    return c.json({
        results: apis.rows,
        hasNextPage,
    })
}
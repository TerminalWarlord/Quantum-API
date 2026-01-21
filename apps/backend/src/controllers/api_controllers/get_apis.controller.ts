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
        category_slug: z.union([
            z.string(),
            z.array(z.string()),
        ]).optional(),
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
    const category_slugs = Array.isArray(category_slug) ? category_slug : (!category_slug ? undefined : [category_slug]);

    console.log(category_slugs);
    try {
        const apis = await db.execute(sql`
        SELECT 
            a.developer_id,
            a.title, 
            CONCAT_WS(' ', u.first_name, u.last_name) AS developer_name,
            a.slug, 
            a.description, 
            c.name AS category_name, 
            c.slug as category_slug, 
            a.thumbnail_url, 
            a.updated_at,
            COUNT(r.id) AS review_count,
            COALESCE(AVG(r.rating), 0) AS rating
        FROM ${sql.identifier('apis')} AS a
        LEFT JOIN ${sql.identifier('reviews')} AS r
            ON r.api_id=a.id
        JOIN ${sql.identifier('categories')} AS c
            ON c.id=a.category_id
        JOIN  ${sql.identifier('users')} AS u
            ON u.id=a.developer_id
        WHERE (
            ${term ? sql`a.title ILIKE ${'%' + term + '%'}` : sql`TRUE`}
            AND 
            ${category_slugs ? sql`c.slug IN (${sql.join(category_slugs)})` : sql`TRUE`}
            )
        GROUP BY
            a.id,
            c.id,
            u.id
        LIMIT ${limit + 1}
        OFFSET ${offset};
    `);
        if (!apis) {
            return c.json({
                message: "Nothing found"
            }, 404);
        }
        const hasNextPage = apis.rowCount && apis.rowCount > limit;
        return c.json({
            results: apis.rows,
            hasNextPage,
        })
    }
    catch (err) {
        console.log(err)
        return c.json({
            message: "Internal Server Error"
        }, 500);
    }
}
import { db, sql } from "@/packages/db";
import { ApiResponse } from "@/packages/types";
import { Context } from "hono";
import * as z from "zod";

export const getAllApis = async (c: Context) => {
    const schema = z.object({
        limit: z.coerce.number().min(1).max(20).default(20),
        offset: z.coerce.number().min(0).default(0),
        query: z.string().optional()
    });

    const parsedData = schema.safeParse({
        limit: c.req.query('limit'),
        offset: c.req.query('offset'),
        query: c.req.query('query'),
    });
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input",
            error: parsedData.error.flatten().fieldErrors
        }, 400);
    }
    try {
        const { limit, offset, query } = parsedData.data;
        const results = await db.execute(sql`
            SELECT 
                a.id,
                a.title,
                a.description,
                a.developer_id,
                a.slug,
                a.thumbnail_url,
                a.status,
                c.name AS category_name,
                c.slug AS category_slug,
                COUNT(DISTINCT s.user_id) AS total_subscribers,
                CONCAT_WS(' ', first_name, last_name) AS name
            FROM apis a
            JOIN users u
                ON u.id=a.developer_id
            JOIN categories c
                ON c.id=a.category_id
            LEFT JOIN subscriptions s
                ON s.api_id=a.id
            WHERE
                ${query ? sql`a.title ILIKE ${`%${query}%`}` : sql`TRUE`}
            GROUP BY
                a.id,
                a.title,
                a.description,
                a.developer_id,
                a.slug,
                a.thumbnail_url,
                a.status,
                c.name,
                c.slug,
                u.first_name,
                u.last_name
            LIMIT ${limit + 1}
            OFFSET ${offset};
        `);

        return c.json({
            results: results.rows.slice(0, limit) as ApiResponse[],
            has_next_page: (results.rowCount ?? 0) > limit
        })
    }
    catch (err) {
        console.log(err);
        return c.json({
            message: "Internal server error"
        }, 500);
    }
}
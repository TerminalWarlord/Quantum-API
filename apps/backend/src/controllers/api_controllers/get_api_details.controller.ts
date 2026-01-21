import { db, sql } from "@/packages/db";
import { Context } from "hono";
import * as z from "zod";

export const getApiDetails = async (c: Context) => {
    const schema = z.string();
    const parsedData = schema.safeParse(c.req.query('api_slug'));
    if (!parsedData.success) {
        return c.json({
            message: "Invalid API slug!"
        }, 400);
    }
    try {
        const results = await db.execute(sql`
            SELECT 
                a.slug,
                a.title,
                a.thumbnail_url,
                a.status,
                a.description,
                a.updated_at AS last_updated,
                CONCAT_WS(' ', u.first_name, u.last_name) AS developer_name,
                c.name AS category_name,
                c.slug AS category_slug,
                (SELECT COUNT(*) FROM subscriptions AS s WHERE s.api_id=a.id) AS subscribers,
                COUNT(r.id) AS review_count,
                COALESCE(AVG(r.rating), 0) AS rating
            FROM apis AS a
            JOIN users AS u
                ON u.id=a.developer_id
            LEFT JOIN reviews AS r
                ON r.api_id=a.id
            JOIN categories AS c
                ON c.id=a.category_id
            WHERE a.slug=${parsedData.data}
            GROUP BY
                a.id, 
                u.id,
                c.id
            ;
        `)
        if (!results) {
            return c.json({
                message: "Failed to get details"
            }, 404);
        }
        return c.json({
            results: results.rows[0]
        });
    }
    catch (err) {
        console.log(err)
        return c.json({
            message: "Internal server error"
        }, 500);
    }
}
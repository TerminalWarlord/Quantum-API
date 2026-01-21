import { ReviewResponse } from "@/packages/types";
import { db, reviewTable, userTable, sql } from "@repo/db/client";
import { Context } from "hono";
import * as z from "zod";

const orderByMap = {
    created_at: sql`r.created_at`,
    rating: sql`r.rating`
} as const;

const orderMap = {
    ASC: sql`ASC`,
    DESC: sql`DESC`,
} as const;

export const getReviews = async (c: Context) => {
    const schema = z.object({
        api_id: z.coerce.number().optional(),
        sort_by: z.enum(["created_at", "rating"]).default("created_at"),
        order: z.enum(["ASC", "DESC"]).default("ASC"),
        limit: z.coerce.number().min(1).max(20).default(10),
        offset: z.coerce.number().min(0).default(0),
    });
    const { api_id, sort_by, order } = c.req.query();
    const parsedData = schema.safeParse({
        api_id,
        sort_by,
        order
    });
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input",
            error: parsedData.error.flatten().fieldErrors
        }, 400);
    }
    try {
        const { limit, api_id, offset, sort_by, order } = parsedData.data;
        const column = orderByMap[sort_by];
        const direction = orderMap[order];
        const results = await db.execute(sql`
            SELECT
                r.id,
                r.content,
                r.rating,
                r.api_id,
                r.status,
                u.id AS user_id,
                u.username,
                u.image,
                a.slug,
                a.title,
                CONCAT_WS(' ', u.first_name, u.last_name) AS name
            FROM reviews r
            JOIN users u
                ON u.id=r.reviewer_id
            JOIN apis a
                ON a.id=r.api_id
            WHERE
                ${api_id ? sql`r.api_id=${api_id}` : sql`TRUE`}
            ORDER BY
                ${column} ${direction}
            LIMIT ${limit + 1}
            OFFSET ${offset};
        `)

        if (!results) {
            return c.json({
                message: "No reviews found"
            }, 404);
        }
        return c.json({
            results: results.rows.slice(0, limit) as ReviewResponse[],
            has_next_page: (results.rowCount ?? 0) > limit
        });

    }
    catch (err) {
        console.log(err)
        return c.json({
            message: "Internal Server Error"
        }, 500);
    }
}
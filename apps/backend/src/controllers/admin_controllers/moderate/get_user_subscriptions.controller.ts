import { Context } from "hono";
import * as z from "zod";
import { db, sql } from "@repo/db/client";
import { BasicUserInfo, Subscription, UserSubscriptions } from "@/packages/types";

export const getUserSubcriptions = async (c: Context) => {
    const schema = z.object({
        user_id: z.coerce.number(),
        limit: z.coerce.number().min(1).max(50).default(10),
        offset: z.coerce.number().min(0).default(0),
    })
    const parsedData = schema.safeParse(c.req.query());
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input",
            error: parsedData.error.flatten().fieldErrors
        }, 400);
    }
    const userId = parsedData.data.user_id;

    const info = await db.execute(sql`
        SELECT
            (SELECT COUNT(*)
            FROM subscriptions s
            WHERE s.user_id = ${userId} AND s.status='active'
            ) AS total_subscriptions,

            (SELECT COALESCE(SUM(i.amount_in_cents), 0)
            FROM invoices i
            WHERE i.user_id = ${userId}
            ) AS total_spent,

            (SELECT COUNT(*)
            FROM apis a
            WHERE a.developer_id = ${userId}
            ) AS api_published
        `)
    const results = await db.execute(sql`
        SELECT 
            s.current_period_start,
            s.current_period_end,
            a.title,
            a.id,
            a.slug,
            a.thumbnail_url,
            p.name AS plan_name,
            p.price_in_cents
        FROM ${sql.identifier('subscriptions')} AS s
        JOIN ${sql.identifier('plans')} AS p
            ON s.plan_id=p.id
        JOIN ${sql.identifier('apis')} AS a
            ON s.api_id=a.id
        WHERE
            ${sql`s.user_id=${userId}`}
            AND s.status='active'
        ORDER BY
            p.price_in_cents DESC
        LIMIT ${parsedData.data.limit + 1}
        OFFSET ${parsedData.data.offset};
    `);
    const userInfo: BasicUserInfo = !info.rowCount ? {
        total_subscriptions: 0,
        total_spent: 0,
        api_published: 0
    } : info.rows[0] as unknown as BasicUserInfo;

    const response: UserSubscriptions = {
        ...userInfo,
        results: results.rows.slice(0, parsedData.data.limit) as unknown as Subscription[],
        has_next_page: (results.rowCount ?? 0) > parsedData.data.limit,
    }
    return c.json(response);

}
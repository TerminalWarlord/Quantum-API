import { db } from "@repo/db/client";
import { Context } from "hono";
import { sql } from "drizzle-orm";
import { DashboardOverview } from "@/packages/types/admin_dashboard/overview";

export const getOverview = async (c: Context) => {
    // get apis count
    // TODO: add redis cache
    try {
        const results = await db.execute(sql`
            SELECT
                (SELECT COUNT(*) FROM apis) AS total_apis,

                (SELECT COUNT(*)
                FROM subscriptions s
                WHERE s.status = 'active'
                ) AS active_subscribers,

                (SELECT COALESCE(SUM(u.requests), 0)
                FROM usages u
                WHERE u.period_type = 'month'
                    AND u.period_start >= date_trunc('month', CURRENT_DATE)
                    AND u.period_start < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
                ) AS api_calls;
        `);

        return c.json({
            ...results.rows[0] as DashboardOverview
        });
    }
    catch (err) {
        return c.json({
            message: "Internal Server Error",
        }, 500);
    }




}
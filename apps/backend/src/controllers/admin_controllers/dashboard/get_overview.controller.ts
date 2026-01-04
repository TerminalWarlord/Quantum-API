import { db } from "@repo/db/client";
import { Context } from "hono";
import { sql } from "drizzle-orm";

export const getOverview = async (c: Context) => {
    // get apis count
    // TODO: add redis cache
    try {
        const apis = await db.execute(sql`SELECT count(*) FROM ${sql.identifier("apis")};`);
        // get active subs
        const subs = await db.execute(sql`
            SELECT COUNT(*) 
            FROM ${sql.identifier("subscriptions")} AS s
            WHERE s.status='active'
        `);

        return c.json({
            total_apis: apis.rowCount,
            active_subscribers: subs.rowCount,
        });
    }
    catch (err) {
        return c.json({
            message: "Internal Server Error",
        }, 500);
    }




}
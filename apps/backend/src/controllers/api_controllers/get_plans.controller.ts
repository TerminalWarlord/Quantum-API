import { db, sql } from "@/packages/db";
import { Plan } from "@/packages/types";
import { Context } from "hono";
import * as z from "zod";

export const getPlans = async (c: Context) => {
    const schema = z.object({
        api_slug: z.string().optional(),
        plan_id: z.coerce.number().optional()
    }).refine(
        (data) => data.api_slug || data.plan_id, {
        error: "Either api_slug or plan_id must be provided",
        path: ["api_slug"]
    }
    );
    const parsedData = schema.safeParse({
        api_slug: c.req.query('api_slug'),
        plan_id: c.req.query('plan_id'),
    });
    if (!parsedData.success) {
        return c.json({
            message: "Invalid Input",
            error: z.treeifyError(parsedData.error).properties
        }, 400);
    }
    try {
        const { api_slug, plan_id } = parsedData.data;
        console.log(plan_id)
        const results = await db.execute(sql`
            SELECT 
                p.id,
                api_id,
                name,
                monthly_requests,
                rate_limit,
                features,
                p.price_id,
                price_in_cents
            FROM plans p
            JOIN apis a
                ON a.id=p.api_id
            WHERE
                ${plan_id ? sql`p.id=${plan_id}` : sql`TRUE`}
                AND ${api_slug ? sql`a.slug=${api_slug}` : sql`TRUE`}
        `);
        if (!results) {
            return c.json({
                message: "Failed to get plans",
            }, 500);
        }
        return c.json({
            results: results.rows as unknown as Plan[]
        });
    }
    catch (err) {
        console.log(err);
        return c.json({
            message: "Internal server error",
        }, 500);
    }
}
import * as z from "zod";
import { CustomContext } from "../../middlewares/user_middleware";
import { db, sql } from "@/packages/db";

export const getApiKeys = async (c: CustomContext) => {
    if (!c.token || !c.token.id) {
        return c.json({
            message: "Unauthorized"
        }, 401)
    }
    const schema = z.string();
    const parsedData = schema.safeParse(c.req.query('api_slug'));
    if (!parsedData.success) {
        return c.json({
            message: "Invalid Input",
            error: z.treeifyError(parsedData.error).errors
        }, 404)
    }
    try {
        const userId = c.token.id;
        const results = await db.execute(sql`
            SELECT
                ak.id AS id,
                p.name
            FROM subscriptions s
            JOIN api_keys ak
                ON ak.subscription_id=s.id
            JOIN apis a
                ON a.id=s.api_id
            JOIN plans p
                ON p.id=s.plan_id
            WHERE 
                a.slug=${parsedData.data} AND s.user_id=${userId};
        `)

        return c.json({
            results: results.rows
        })
    }
    catch (err) {
        return c.json({
            results: "Internal server error"
        }, 500);
    }
}
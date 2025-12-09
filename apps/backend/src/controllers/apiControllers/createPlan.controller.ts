import { db, planTable } from "@repo/db/client";
import * as z from "zod";
import { CustomContext } from "../../middlewares/middleware";

export const postCreatePlan = async (c: CustomContext) => {
    if (!c.token || !c.token.id) {
        return c.json({
            message: "Unauthorized"
        }, 401);
    }
    const schema = z.object({
        name: z.string().max(255).min(3),
        features: z.string().min(10),
        monthly_requests: z.number().default(10000),
        rate_limit: z.number().default(1000),
        api_id: z.number()
    });

    const parseData = schema.safeParse(await c.req.json());
    if (!parseData.success) {
        return c.json({
            message: "Failed to add Plan",
            error: parseData.error.flatten().fieldErrors
        }, 401);
    }
    try {
        await db.insert(planTable).values({
            ...parseData.data
        })
        return c.json({
            message: "Plan has been created"
        })
    }
    catch (err) {
        console.log(err);
        return c.json({
            message: "Failed to create Plan"
        }, 501);
    }
}
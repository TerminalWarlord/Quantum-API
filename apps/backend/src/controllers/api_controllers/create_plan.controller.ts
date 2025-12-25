import { apiTable, db, planTable } from "@repo/db/client";
import * as z from "zod";
import { CustomContext } from "../../middlewares/middleware";
import { eq } from "drizzle-orm";
import { createPrice } from "../../lib/payment_provider_helpers/paddle";


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
        api_id: z.number(),
        price_in_cents: z.number().min(0).max(100000000),
    });

    const parseData = schema.safeParse(await c.req.json());
    if (!parseData.success) {
        return c.json({
            message: "Failed to add Plan",
            error: parseData.error.flatten().fieldErrors
        }, 401);
    }
    try {
        const api = await db
            .select()
            .from(apiTable)
            .where(eq(apiTable.id, parseData.data.api_id))
            .limit(1);
        if (!api || !api.length) {
            return c.json({
                message: "API doesnt exist!"
            }, 404);
        }

        // const product_id = await createProduct({
        //     currency: "USD",
        //     description: api[0]?.description || "",
        //     discount: 0,
        //     name: `${api[0]?.title} (${parseData.data.name})`,
        //     price: parseData.data.price_in_cents
        // });
        const price_id = await createPrice({
            currency: "USD",
            description: api[0]?.description || "",
            name: `${api[0]?.title} (${parseData.data.name})`,
            price: parseData.data.price_in_cents,
            productId: api[0]?.product_id || ""
        });
        const [plan] = await db.insert(planTable).values({
            price_id: price_id,
            ...parseData.data,
        }).returning({
            id: planTable.id,
            product_id: planTable.price_id,
            name: planTable.name,
            monthly_requests: planTable.monthly_requests,
            price_in_cents: planTable.price_in_cents,
            rate_limit: planTable.rate_limit,
            api_id: planTable.api_id,
        });
        return c.json({
            message: "Plan has been created",
            ...plan
        })
    }
    catch (err) {
        console.log(err);
        return c.json({
            message: "Failed to create Plan"
        }, 501);
    }
}
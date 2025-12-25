import { db, planTable, subscriptionTable } from "@repo/db/client";
import { ForbiddenError, InternalServerError, NotFoundError, SubscriptionDataType, UnauthorizedError } from "@repo/types";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "";


export const subscriptionActivatedHelper = async (subscriptionData: SubscriptionDataType) => {
    const subscriptionId = subscriptionData.id;

    console.log(subscriptionData.items[0].product.id);

    const priceId = subscriptionData.items[0].price.id;
    if (!priceId) {
        throw new ForbiddenError("Invalid price id",);
    }

    const plans = await db.select().from(planTable);
    console.log(plans)


    const [plan] = await db.select().from(planTable).where(eq(planTable.price_id, priceId));
    if (!plan) {
        throw new NotFoundError("Product doesn't exist!");

    }

    const jwtToken = subscriptionData.custom_data?.user_id;
    if (!jwtToken) {
        throw new UnauthorizedError("Invalid user id");
    }
    try {
        const payload = jwt.verify(jwtToken, JWT_SECRET) as any;
        if (!payload || !payload.id) {
            throw new UnauthorizedError("Invalid user ID");
        }
        const userId = payload.id;
        const [sub] = await db
            .insert(subscriptionTable)
            .values({
                current_period_start: new Date(subscriptionData.current_billing_period.starts_at),
                current_period_end: new Date(subscriptionData.current_billing_period.ends_at),
                plan_id: plan.id,
                api_id: plan.api_id,
                provider_subscription_id: subscriptionId,
                user_id: userId
            }).returning({ id: subscriptionTable.id, user_id: subscriptionTable.user_id });
        if (!sub) {
            throw new InternalServerError("Failed to create subscription");
        }
        return {
            message: "Successfully created subscription.",
            ...sub
        };
    }
    catch (err) {
        console.log(err)
        throw new UnauthorizedError("Failed to verify token");
    }
}
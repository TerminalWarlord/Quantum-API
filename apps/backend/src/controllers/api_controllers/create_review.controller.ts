import { db, reviewTable, subscriptionTable } from "@repo/db/client";
import { CustomContext } from "../../middlewares/middleware";
import * as z from "zod";
import { and, eq } from "drizzle-orm";

export const postCreateReview = async (c: CustomContext) => {
    if (!c.token || !c.token.id) {
        return c.json({
            message: "Unauthorized"
        }, 401);
    }
    const schema = z.object({
        api_id: z.coerce.number(),
        content: z.string().min(5).max(1000),
        rating: z.coerce.number().min(1).max(5),
    });

    const parsedData = schema.safeParse(await c.req.json());
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input!"
        }, 400);
    }

    // Check if user is subscribed to the API
    try {
        const [subsciption] = await db.select({
            status: subscriptionTable.status
        })
            .from(subscriptionTable)
            .where(
                and(
                    eq(subscriptionTable.user_id, c.token.id),
                    eq(subscriptionTable.api_id, parsedData.data.api_id)
                ));
        if (!subsciption || subsciption.status !== "active") {
            return c.json({
                message: "You're not subscribed to the API, you can't add review it."
            }, 403);
        }
    }
    catch (er) {
        return c.json({
            message: "Failed to check user subscription!"
        }, 500);
    }

    try {
        await db.insert(reviewTable).values({
            ...parsedData.data,
            reviewer_id: c.token.id
        })
        return c.json({
            message: "Successfully added review"
        }, 201);
    }
    catch (err) {
        console.log(err)
        return c.json({
            message: "Failed to add review"
        }, 409);
    }
}
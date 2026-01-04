import { db, reviewTable } from "@repo/db/client";
import { ReviewStatus } from "@repo/types";
import { Context } from "hono";
import * as z from "zod";
import { eq } from "drizzle-orm";

export const patchUpdateReview = async (c: Context) => {
    const schema = z.object({
        review_id: z.coerce.number(),
        status: z.enum(ReviewStatus)
    });
    let body;
    try {
        body = await c.req.json();
    }
    catch (err) {
        return c.json({
            error: "Request body must be valid JSON"
        }, 400);
    }
    const parsedData = schema.safeParse({
        review_id: c.req.param('review_id'),
        status: body?.status
    });
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input",
            error: parsedData.error.flatten().fieldErrors
        }, 400);
    }

    const reviewId = parsedData.data;
    try {
        const review = await db.update(reviewTable)
            .set({
                status: parsedData.data.status
            })
            .where(eq(reviewTable.id, parsedData.data.review_id))
            .returning({ id: reviewTable.id });
        if (!review) {
            return c.json({
                message: "Review not found!",
            }, 404);
        }
        return c.json({
            message: "Review status has been updated",
        });

    }
    catch (err) {
        return c.json({
            message: "Internal Server Error",
        }, 500);
    }
}
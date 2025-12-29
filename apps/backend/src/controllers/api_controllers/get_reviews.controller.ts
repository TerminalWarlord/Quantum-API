import { db, reviewTable, userTable } from "@repo/db/client";
import { Context } from "hono";
import * as z from "zod";
import { eq, asc, desc, and } from "drizzle-orm";

const orderByMap = {
    created_at: reviewTable.created_at,
    rating: reviewTable.rating
}

export const getReviews = async (c: Context) => {
    const schema = z.object({
        api_id: z.coerce.number(),
        sort_by: z.enum(["created_at", "rating"]).default("created_at"),
        order: z.enum(["asc", "desc"]).default("asc"),
        limit: z.coerce.number().min(1).max(20).default(10),
        offset: z.coerce.number().min(0).default(0),
    });
    const { api_id, sort_by, order } = c.req.query();
    const parsedData = schema.safeParse({
        api_id,
        sort_by,
        order
    });
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input",
            error: parsedData.error.flatten().fieldErrors
        }, 400);
    }
    try {
        const column = orderByMap[parsedData.data.sort_by];
        const reviews = await db.select({
            id: reviewTable.id,
            content: reviewTable.content,
            user_id: userTable.id,
            first_name: userTable.first_name,
            posted_at: reviewTable.created_at,
            rating: reviewTable.rating
        })
            .from(reviewTable)
            .fullJoin(userTable, eq(reviewTable.reviewer_id, userTable.id))
            .where(and(
                eq(reviewTable.api_id, parsedData.data.api_id),
                eq(reviewTable.status, "PUBLISHED"),
            ))
            .orderBy(parsedData.data.order === "asc" ? asc(column) : desc(column))
            .limit(parsedData.data.limit + 1)
            .offset(parsedData.data.offset);

        if (!reviews) {
            return c.json({
                message: "No reviews found"
            }, 404);
        }
        return c.json({
            results: reviews.slice(0, parsedData.data.limit),
            hasNextPage: reviews.length > parsedData.data.limit
        });

    }
    catch (err) {
        return c.json({
            message: "Internal Server Error"
        }, 500);
    }
}
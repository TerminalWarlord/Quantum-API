// import { Context } from "hono";
// import * as z from "zod";
// import { ilike, sql } from "drizzle-orm";
// import { db, reviewTable } from "@repo/db/client";

// export const getReviews = async (c: Context) => {
//     const schema = z.object({
//         term: z.string().optional(),
//         user_id: z.coerce.number(),
//         limit: z.coerce.number().min(1).max(50).default(10),
//         offset: z.coerce.number().max(0).default(0),
//     })
//     const parsedData = schema.safeParse(c.req.query());
//     if (!parsedData.success) {
//         return c.json({
//             message: "Invalid input",
//             error: parsedData.error.flatten().fieldErrors
//         }, 400);
//     }
//     const reviews = await db.select()
//         .from(reviewTable)
//         .where(ilike(reviewTable.content, sql`%${parsedData.data.term}%`))
//         .limit(parsedData.data.limit + 1)
//         .offset(parsedData.data.offset);
//     if (!reviews) {
//         return c.json({
//             message: "Nothing found",
//         }, 404);
//     }
//     return c.json({
//         results: reviews.slice(0, parsedData.data.limit),
//         hasNextPage: reviews.length > parsedData.data.limit
//     }, 404);
// }
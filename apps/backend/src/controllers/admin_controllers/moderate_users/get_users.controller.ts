import { db, subscriptionTable, transactionTable, userTable } from "@repo/db/client";
import { Context } from "hono";
import * as z from "zod";
import { eq } from "drizzle-orm";

export const getAllUsers = async (c: Context) => {
    const schema = z.object({
        term: z.string().optional(),
        limit: z.coerce.number().min(1).max(50).default(30),
        offset: z.coerce.number().min(0).default(0),
        sort_by: z.enum(["created_at", "spending", "alphabet"]).default("alphabet"),
        order: z.enum(["asc", "desc"]).default("asc")
    });
    // TODO: add sorting
    const parsedData = schema.safeParse(c.req.query());
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input",
            error: parsedData.error.flatten().fieldErrors
        }, 400);
    }
    const users = await db.select({
        id: userTable.id,
        first_name: userTable.first_name,
        last_name: userTable.last_name,
        email: userTable.email,
        role: userTable.role
    })
        .from(userTable)
        .limit(parsedData.data.limit + 1)
        .offset(parsedData.data.offset);
    if (!users) {
        return c.json({
            message: "Found nothing",
        }, 404);
    }
    return c.json({
        results: users.slice(0, parsedData.data.limit),
        hasNextPage: users.length > parsedData.data.limit
    });

}
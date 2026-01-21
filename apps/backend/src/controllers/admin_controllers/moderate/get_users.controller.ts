import { User, UserResponse } from "@/packages/types";
import { db, sql, userTable } from "@repo/db/client";
import { Context } from "hono";
import * as z from "zod";

export const getAllUsers = async (c: Context) => {
    const schema = z.object({
        term: z.string().optional(),
        limit: z.coerce.number().min(1).max(50).default(30),
        offset: z.coerce.number().min(0).default(0),
        // sort_by: z.enum(["created_at", "spending", "alphabet"]).default("alphabet"),
        // order: z.enum(["asc", "desc"]).default("asc")
    });
    // TODO: add sorting and term
    const parsedData = schema.safeParse(c.req.query());
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input",
            error: parsedData.error.flatten().fieldErrors
        }, 400);
    }
    try {
        const results = await db.execute(sql`
            SELECT 
                u.id,
                CONCAT_WS(' ', first_name, last_name) as name,
                email,
                role,
                COALESCE(SUM(amount_in_cents), 0) AS amount_in_cents,
                u.created_at
            FROM users AS u
            LEFT JOIN invoices AS i
            ON i.user_id=u.id
            WHERE
                ${parsedData.data.term ? sql`
                u.first_name ILIKE ${`%${parsedData.data.term}%`}
                OR u.last_name ILIKE ${`%${parsedData.data.term}%`}` : sql`TRUE`}
                
            GROUP BY 
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                u.role
            LIMIT ${parsedData.data.limit + 1}
            OFFSET ${parsedData.data.offset};
        `)

        return c.json({
            results: results.rows.slice(0, parsedData.data.limit) as UserResponse[],
            has_next_page: (results.rowCount ?? 0) > parsedData.data.limit
        });

    }
    catch (err) {
        console.log(err)
        return c.json({
            message: "Internal server error"
        }, 500);
    }
}
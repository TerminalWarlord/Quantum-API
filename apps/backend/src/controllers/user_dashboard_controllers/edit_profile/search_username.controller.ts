import { db, sql } from "@/packages/db";
import * as z from "zod";
import { CustomContext } from "../../../middlewares/user_middleware";

export const getSearchUsername = async (c: CustomContext) => {
    if (!c.token || !c.token.id) {
        return c.json({
            message: "Unauthorized",
        }, 401);
    }
    const schema = z.string()
    const parsedData = schema.safeParse(c.req.query('username'));
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input",
            error: z.treeifyError(parsedData.error).errors
        }, 400);
    }
    try {
        const results = await db.execute(sql`
            SELECT
                username
            FROM users
            WHERE 
                username=${parsedData.data}
                AND id<>${c.token.id}
            LIMIT 1;
        `);
        if (!results || !results.rowCount) {
            // username available
            return c.json({
                success: true
            });
        }
        // username taken
        return c.json({
            success: false
        });

    }
    catch (err) {
        return c.json({
            message: "Internal server error",
        }, 500);
    }
}
import { db, sql } from "@/packages/db";
import { CustomContext } from "../../../middlewares/user_middleware";
import * as z from "zod";

export const postUpdateUser = async (c: CustomContext) => {
    if (!c.token || !c.token.id) {
        return c.json({
            message: "Unauthorized"
        }, 401);
    }
    try {
        const schema = z.object({
            first_name: z.string(),
            last_name: z.union([
                z.string(),
                z.null()
            ]),
            username: z.string()
        });
        const parsedData = schema.safeParse(await c.req.json());
        if (!parsedData.success) {
            return c.json({
                message: "Invalid input",
                error: z.treeifyError(parsedData.error).properties
            }, 400);
        }
        const { first_name, username, last_name } = parsedData.data;
        const results = await db.execute(sql`
            UPDATE users
            SET 
                first_name=${first_name},
                last_name=${last_name},
                username=${username}
            WHERE
                id=${c.token.id}
            RETURNING id;
        `);
        if (!results || !results.rowCount) {
            return c.json({
                message: "Failed to update user"
            }, 500);
        }
        return c.json({
            message: "Successfully updated user data"
        });
    }
    catch (err) {
        return c.json({
            message: "Internal server error"
        }, 500);
    }
}
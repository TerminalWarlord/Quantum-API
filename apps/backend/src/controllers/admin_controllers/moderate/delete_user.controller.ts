import { db, userTable, eq } from "@repo/db/client";
import { Context } from "hono";
import * as z from "zod";

export const deleteUser = async (c: Context) => {
    const schema = z.coerce.number();
    const parsedData = schema.safeParse(c.req.param('user_id'));
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input",
            error: parsedData.error.flatten().formErrors
        }, 400);
    }
    try {
        const result = await db
            .delete(userTable)
            .where(eq(userTable.id, parsedData.data))
            .returning({
                id: userTable.id
            });
        if (result.length == 0) {
            return c.json({
                message: "User not found"
            }, 404);
        }
        return c.json({
            message: "Successfully removed user"
        });
    }
    catch (err) {
        return c.json({
            message: "Failed to remove user"
        }, 500);
    }
}
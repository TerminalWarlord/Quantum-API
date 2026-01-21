import { db, sql } from "@/packages/db"
import { Context } from "hono"

export const getCategories = async (c: Context) => {
    // TODO: add rate limiting
    try {
        const results = await db.execute(sql`
            SELECT slug, name 
            FROM ${sql.identifier('categories')};
        `)
        if (!results.rowCount) {
            return c.json({
                message: "Failed to get categories"
            }, 404);
        }

        return c.json({
            results: results.rows
        })
    }
    catch(err) {
        console.log(err)
        return c.json({
            message: "Internal Server Error"
        }, 500);
    }
}
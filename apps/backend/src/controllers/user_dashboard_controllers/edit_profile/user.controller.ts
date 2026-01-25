import { db, sql } from "@/packages/db";
import { CustomContext } from "../../../middlewares/user_middleware";
import { getDownloadSignedUrl } from "../../../lib/sign_urls";

export const getUser = async (c: CustomContext) => {
    if (!c.token || !c.token.id) {
        return c.json({
            message: "Unauthorized"
        }, 401);
    }
    try {
        const results = await db.execute(sql`
            SELECT 
                first_name,
                last_name,
                username,
                email,
                image
            FROM users
            WHERE id=${c.token.id}
            LIMIT 1;
        `);
        if (!results) {
            return c.json({
                message: "No results"
            }, 404);
        }
        return c.json({
            results: {
                ...results.rows[0],
                image: await getDownloadSignedUrl(results.rows[0].image as string)
            }
        });

    }
    catch (err) {
        return c.json({
            message: "Internal server error"
        }, 500);
    }
}
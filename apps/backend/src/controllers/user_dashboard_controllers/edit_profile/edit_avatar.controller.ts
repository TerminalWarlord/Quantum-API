import { db, sql } from "@/packages/db";
import { CustomContext } from "../../../middlewares/user_middleware";
import * as z from "zod";
import { getDownloadSignedUrl } from "../../../lib/sign_urls";


export const postUpdateAvatar = async (c: CustomContext) => {
    if (!c.token || !c.token.id) {
        return c.json({
            message: "Unauthorized"
        }, 401);
    }
    const schema = z.object({
        path: z.string()
    });
    const parsedData = schema.safeParse(await c.req.json());
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input"
        }, 400);
    }
    try {
        const result = await db.execute(sql`
            UPDATE users
            SET image=${parsedData.data.path}
            WHERE id=${c.token.id}
            RETURNING image;
        `);
        console.log(result);
        if (!result || !result.rowCount) {
            return c.json({
                message: "Failed to update image!"
            }, 500);
        }
        const updatedImage = await getDownloadSignedUrl(parsedData.data.path);
        return c.json({
            image_url: updatedImage
        })

    }
    catch (err) {
        return c.json({
            message: "Internal Server Error"
        }, 500);
    }
}
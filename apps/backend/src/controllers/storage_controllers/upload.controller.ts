import { nanoid } from "nanoid";
import { getUploadSignedUrl } from "../../lib/sign_urls";
import { CustomContext } from "../../middlewares/user_middleware";
import * as z from "zod";
import slugify from "slugify";


const EXT_BY_TYPE: Record<string, string> = {
    "image/webp": ".webp",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/jpg": ".jpg",
};

export const postUploadSignUrl = async (c: CustomContext) => {
    if (!c.token || !c.token.id) {
        return c.json({
            message: "Unauthorized"
        }, 401);
    }

    const schema = z.object({
        contentType: z.enum(["image/webp", "image/png", "image/jpeg", "image/jpg"]),
        fileName: z.string()
    });
    const parsedData = schema.safeParse(await c.req.json());
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input",
            error: z.treeifyError(parsedData.error).properties
        }, 400);
    }
    try {
        const { contentType, fileName } = parsedData.data;
        const slugifiedFilename = slugify(fileName);
        const filename = slugifiedFilename.replace(/\.[^.]+$/, "");
        const extension = slugifiedFilename.replace(/^.*(\.[^.]+)$/, "$1")
        // console.log(extension, contentType, EXT_BY_TYPE[contentType], filename)
        if (EXT_BY_TYPE[contentType] !== extension) {
            return c.json({
                message: "Invalid file extension",
            }, 400);
        }
        const uniqueFilename = `${slugify(filename)}_${nanoid()}`
        const path = `quantumapi/images/${uniqueFilename}${EXT_BY_TYPE[parsedData.data.contentType]}`
        const signedUrl = await getUploadSignedUrl(path, 300);
        return c.json({
            upload_url: signedUrl,
            path
        });
    }
    catch (err) {
        console.log(err);
        return c.json({
            message: "Internal server error"
        }, 500);
    }
}
import { Context } from "hono";
import * as z from "zod";
import { createSlug } from "../../lib/create_slug";

export const postCreateCategory = async (c: Context) => {
    const schema = z.object({
        name: z.string().min(3).max(30)
    });
    const parsedData = schema.safeParse(await c.req.json());
    if (!parsedData.success) {
        return c.json({
            message: "Failed to create category!",
            error: parsedData.error.flatten().fieldErrors
        }, 400);
    }
    return c.json({
        message: "Successful",
        name: parsedData.data.name,
        ...await createSlug(parsedData.data.name)
    });
}
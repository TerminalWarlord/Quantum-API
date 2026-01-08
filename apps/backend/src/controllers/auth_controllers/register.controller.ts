import { Context } from "hono";
import * as z from "zod";
import { db, userTable } from "@repo/db/client";



export const registerController = async (c: Context) => {

    const schema = z.object({
        first_name: z.string().max(255),
        last_name: z.string().max(255),
        email: z.email(),
        password: z.string().max(32)
    })
    const parsedData = schema.safeParse(await c.req.json());
    if (!parsedData.success) {
        return c.json({
            message: parsedData.error.flatten().fieldErrors
        }, 400);
    }
    try {
        const hashed = await Bun.password.hash(parsedData.data.password, {
            algorithm: 'bcrypt',
            cost: 5
        });
        try {
            // TODO: generate username
            const [user] = await db.insert(userTable).values({
                email: parsedData.data.email,
                first_name: parsedData.data.first_name,
                last_name: parsedData.data.last_name,
                password: hashed,
                username: parsedData.data.email,
                provider: "credentials",
            }).returning();
            return c.json({
                message: "User has been created",
                user_id: user.id
            }, 201);
        }
        catch (err) {
            return c.json({
                message: "Failed to create user"
            }, 409);
        }
    }
    catch (err) {
        console.error(err);
        return c.json({
            message: "Internal Server Error!"
        }, 500)
    }

}
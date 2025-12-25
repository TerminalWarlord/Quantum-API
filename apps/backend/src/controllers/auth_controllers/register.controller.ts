import { Context } from "hono";
import * as z from "zod";
import { db, userTable } from "@repo/db/client";
import bcrypt from "bcrypt";



export const registerController = async (c: Context) => {
    
    const schema = z.object({
        first_name: z.string().max(255),
        last_name: z.string().max(255),
        username: z.string().max(20),
        email: z.email(),
        password: z.string().max(32)
    })
    const parsedData = schema.safeParse(await c.req.json());
    if (!parsedData.success) {
        return c.json({
            message: parsedData.error.flatten().fieldErrors
        }, 401);
    }
    try {
        const hashed = await bcrypt.hash(parsedData.data.password, 5);
        await db.insert(userTable).values({
            email: parsedData.data.email,
            first_name: parsedData.data.first_name,
            last_name: parsedData.data.last_name,
            password: hashed,
            username: parsedData.data.username
        })

        return c.json({
            message: "User has been created"
        });
    }
    catch (err) {
        console.log(err)
        return c.json({
            message: "Something went wrong!"
        }, 501)
    }

}
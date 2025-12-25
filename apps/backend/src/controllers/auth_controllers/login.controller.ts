import { db, userTable } from "@repo/db/client";
import { Context } from "hono";
import jwt from "jsonwebtoken";
import * as z from "zod";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "";

export const loginController = async (c: Context) => {
    const schema = z.object({
        email: z.email().min(3).max(255),
        password: z.string().min(3).max(255),
    })

    const parsedData = schema.safeParse(await c.req.json());
    if (!parsedData.success) {
        return c.json({
            message: "Unauthorized!"
        }, 401);
    }
    try {
        const users = await db.select()
            .from(userTable)
            .where(eq(userTable.email, parsedData.data.email))
        if (!users || !users.length) {
            return c.json({
                message: "User doesn't exist!"
            }, 401);
        }
        const userPassword = users[0]?.password;
        const passwordMatches = await Bun.password.verify(parsedData.data.password, userPassword!);
        if (passwordMatches) {
            // TODO: Update expiry
            const token = jwt.sign({ id: users[0]?.id }, JWT_SECRET, { expiresIn: "30d" });
            return c.json({
                token,
                message: "Successfully logged in!",
            })
        }
        return c.json({
            message: "Wrong password!"
        }, 401);
    }
    catch (err) {
        console.log(err);
    }
    return c.json({
        message: "Something went wrong"
    }, 501);


}
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import * as z from "zod";

const JWT_SECRET = process.env.JWT_SECRET!;

// TODO: add rate limiter
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
        return Response.json({
            message: "Unauthorized"
        }, { status: 401 });
    }
    const schema = z.object({
        api_key_id: z.coerce.number().optional(),
        id: z.coerce.number().optional(),
    }).refine(
        (data) => data.api_key_id || data.id
    )

    const parsedData = schema.safeParse(await req.json());
    if (!parsedData.success) {
        return Response.json({
            message: "Invalid Input"
        }, { status: 400 });
    }
    const body: {
        api_key_id?: number,
        id?: number,
    } = {};
    const { api_key_id, id } = parsedData.data;
    if (api_key_id) body.api_key_id = api_key_id;
    else if (id) body.id = id;
    else {
        return Response.json({
            message: "Invalid Input"
        }, { status: 400 });
    }


    const token = jwt.sign(body, JWT_SECRET, { expiresIn: 2 * 60 });
    return Response.json({
        token
    })
}
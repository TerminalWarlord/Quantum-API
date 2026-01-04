import { db, endpointTable } from "@repo/db/client";
import { EndpointMethod } from "@repo/types";
import * as z from "zod";
import { CustomContext } from "../../middlewares/user_middleware";

export const postCreateEndpoint = async (c: CustomContext) => {
    const schema = z.object({
        title: z.string(),
        api_id: z.number(),
        path: z.string(),
        description: z.string(),
        method: z.enum(EndpointMethod).default(EndpointMethod.GET),

    });
    const parsedData = schema.safeParse(await c.req.json());
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input!",
            error: parsedData.error.flatten().fieldErrors
        }, 400);
    }

    try {
        const [endpoint] = await db.insert(endpointTable).values({
            ...parsedData.data
        }).returning({ id: endpointTable.id });
        if (!endpoint) {
            return c.json({
                message: "Failed to create endpoint"
            }, 500);
        }
        return c.json({
            ...parsedData.data,
            endpoint_id: endpoint?.id
        }, 201);
    }
    catch (err: any) {
        if (err.code === "23505") {
            return c.json({
                message: "Endpoint already exists",
            }, 409);
        }
        return c.json({
            message: "Failed to create endpoint"
        }, 500);
    }

}
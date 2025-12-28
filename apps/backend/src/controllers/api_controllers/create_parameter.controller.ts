import { db, parameterTable } from "@repo/db/client";
import * as z from "zod";
import { CustomContext } from "../../middlewares/middleware";
import { ParameterLocation, ParameterType } from "@repo/types";

export const postCreateParameter = async (c: CustomContext) => {
    const schema = z.object({
        name: z.string(),
        endpoint_id: z.number(),
        location: z.enum(ParameterLocation).default(ParameterLocation.QUERY),
        is_required: z.boolean().default(false),
        default_value: z.string(),
        type: z.enum(ParameterType).default(ParameterType.STRING)
    });
    const parsedData = schema.safeParse(await c.req.json());
    if (!parsedData.success) {
        return c.json({
            message: "Invalid input!",
            error: parsedData.error.issues
        }, 400);
    }

    try {
        const [parameter] = await db.insert(parameterTable).values({
            ...parsedData.data
        }).returning({ id: parameterTable.id });
        if (!parameter) {
            return c.json({
                message: "Failed to create parameter"
            }, 500);
        }

        return c.json({
            ...parsedData.data,
            parameter_id: parameter.id
        });
    }
    catch (err: any) {
        if (err.code === "23505") {
            return c.json({
                message: "Parameter already exists",
            }, 409);
        }
        return c.json({
            message: "Failed to create endpoint"
        }, 500);
    }

}
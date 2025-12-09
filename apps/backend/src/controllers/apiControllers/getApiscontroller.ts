import { apiTable, db, planTable } from "@repo/db/client";
import { Context } from "hono";
import { eq } from "drizzle-orm";


export const getApis = async (c: Context) => {
    const apis = await db
        .select()
        .from(apiTable)
        .fullJoin(planTable, eq(apiTable.id, planTable.api_id))
        .limit(30)
    return c.json({
        ...apis
    })
}
import { RevenuePeriod } from "@repo/types";
import { Context } from "hono";
import { getRevenue } from "../../../lib/admin_helpers/get_revenue";

export const getOverviewRevenue = async (c: Context) => {
    try {
        return c.json({
            revenue: [
                await getRevenue({
                    period: RevenuePeriod.HOUR,
                }),
                await getRevenue({
                    period: RevenuePeriod.DAY,
                }),
                await getRevenue({
                    period: RevenuePeriod.MONTH,
                }),
                await getRevenue({
                    period: RevenuePeriod.YEAR,
                }),
            ]
        });
    }
    catch {
        return c.json({
            message: "Internal Server Error",
        }, 500);
    }
}
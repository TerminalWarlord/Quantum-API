import { RevenuePeriod } from "@repo/types";
import { Context } from "hono";
import { getUsage } from "../../../lib/admin_helpers/get_usage";

export const getOverviewUsage = async (c: Context) => {
    try {
        return c.json({
            usage: [
                await getUsage({
                    period: RevenuePeriod.HOUR,
                }),
                await getUsage({
                    period: RevenuePeriod.DAY,
                }),
                await getUsage({
                    period: RevenuePeriod.MONTH,
                }),
                await getUsage({
                    period: RevenuePeriod.YEAR,
                }),
            ]
        });
    }
    catch (err) {
        return c.json({
            message: "Internal Server Error",
        }, 500);
    }
}
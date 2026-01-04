import { RevenuePeriod } from "@repo/types";
import { Context } from "hono";
import { getAllRequests, getFailedRequests } from "../../../lib/admin_helpers/get_status_codes";

export const getOverviewFailedRequests = async (c: Context) => {
    try {
        return c.json({
            results: [
                await getFailedRequests({
                    period: RevenuePeriod.HOUR,
                }),
                await getFailedRequests({
                    period: RevenuePeriod.DAY,
                }),
                await getFailedRequests({
                    period: RevenuePeriod.MONTH,
                }),
                await getFailedRequests({
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


export const getOverviewAllRequests = async (c: Context) => {
    try {
        return c.json({
            results: [
                await getAllRequests({
                    period: RevenuePeriod.HOUR,
                }),
                await getAllRequests({
                    period: RevenuePeriod.DAY,
                }),
                await getAllRequests({
                    period: RevenuePeriod.MONTH,
                }),
                await getAllRequests({
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
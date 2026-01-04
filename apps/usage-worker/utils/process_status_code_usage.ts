import { makeUsageKeys, getHourStart, getMonthStart } from "@repo/shared";
import { redis } from "@repo/redis";
import { db, statusCodeUsageTable, usageTable } from "@repo/db/client";
import { MetricType } from "@repo/types";

interface Subscription {
    id: number;
    api_id: number
}

const HTTP_STATUS_CODES = [
    // 1xx
    100, 101, 102, 103,
    // 2xx
    200, 201, 202, 203, 204, 205, 206, 207, 208, 226,
    // 3xx
    300, 301, 302, 303, 304, 305, 307, 308,
    // 4xx
    400, 401, 402, 403, 404, 405, 406, 407, 408, 409,
    410, 411, 412, 413, 414, 415, 416, 417, 418,
    421, 422, 423, 424, 425, 426, 428, 429, 431, 451,
    // 5xx
    500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511,
];


async function updateDB({
    subscription,
    currentDate,
    count,
    status_code,
    period_type,
}: {
    subscription: Subscription,
    currentDate: Date,
    count: number,
    status_code: number,
    period_type: "day" | "hour"
}) {
    const start = getHourStart(currentDate);
    await db.insert(statusCodeUsageTable).values({
        api_id: subscription.api_id,
        subscription_id: subscription.id,
        count: count,
        status_code: status_code,
        period_start: start,
        period_type: period_type
    }).onConflictDoUpdate({
        target: [
            statusCodeUsageTable.subscription_id,
            statusCodeUsageTable.period_start,
            statusCodeUsageTable.api_id,
            statusCodeUsageTable.period_type,
            statusCodeUsageTable.status_code
        ],
        set: {
            count,
            updated_at: new Date()
        }
    });
}

// `usage:hour:${subscription_id}:${YYYY}${MM}${DD}${HH}:${metric}:${status_code}:${api_id}:${subscription_id}`
export async function processStatusCodeUsage(subscription: Subscription) {
    const keys = makeUsageKeys(subscription.id, MetricType.STATUS_CODES);

    for (const status_code of HTTP_STATUS_CODES) {
        const { hourKey, dayKey, currentDate } = {
            ...keys,
            hourKey: keys.hourKey + `:${status_code}:${subscription.api_id}:${subscription.id}`,
            dayKey: keys.dayKey + `:${status_code}:${subscription.api_id}:${subscription.id}`
        };
        const [hourRaw, dayRaw] = await redis.mget(hourKey, dayKey);
        const hourCount = Number(hourRaw) || 0;
        const dayCount = Number(dayRaw) || 0;


        // upsert hourly updates
        if (hourCount > 0) {
            await updateDB({
                currentDate,
                status_code,
                subscription: subscription,
                period_type: "hour",
                count: hourCount,
            });
        }

        // upsert daily updates
        if (dayCount > 0) {
            await updateDB({
                currentDate,
                status_code,
                subscription: subscription,
                period_type: "day",
                count: dayCount,
            });
        }
    }
}
import { redis } from "@repo/redis";



function makeUsageKeys(api_id: number, api_key: string, metric: string) {
    const date = new Date();
    const YYYY = date.getUTCFullYear();
    const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
    const DD = String(date.getUTCDate()).padStart(2, "0");
    const HH = String(date.getUTCHours()).padStart(2, "0");

    return {
        hourKey: `usage:hour:${api_id}:${api_key}:${YYYY}${MM}${DD}${HH}:${metric}`,
        monthKey: `usage:month:${api_id}:${api_key}:${YYYY}${MM}${DD}:${metric}`
    }
}

export const checkAndIncrUsage = async ({ monthly_requests, rate_limit, api_id, api_key, metric }:
    {
        monthly_requests: number,
        rate_limit: number,
        api_id: number,
        api_key: string,
        metric: string
    }
) => {
    const { hourKey, monthKey } = makeUsageKeys(api_id, api_key, metric);
    const hourTTL = 60 * 60 * 2;
    const monthTTL = 24 * 45 * 60 * 60;
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
        await redis.watch(hourKey, monthKey);
        const [curHour, curMonth] = await redis.mget(hourKey, monthKey);
        const hourCount = parseInt(curHour || "0");
        const monthCount = parseInt(curMonth || "0");
        if ((monthly_requests >= 0 && monthly_requests < monthCount + 1) ||
            (rate_limit >= 0 && rate_limit < hourCount + 1)
        ) {
            await redis.unwatch();
            return {
                allowed: false,
                hourCount,
                monthCount
            };
        }
        const tx = redis.multi();
        tx.incrby(hourKey, 1);
        tx.incrby(monthKey, 1);

        const result = await tx.exec();
        if (result === null) continue;

        const curHourTTL = await redis.ttl(hourKey);
        if (curHourTTL < 0) await redis.expire(hourKey, hourTTL);

        const curMonthTTL = await redis.ttl(monthKey);
        if (curMonthTTL < 0) await redis.expire(monthKey, monthTTL);

        return {
            allowed: true,
            hourCount: hourCount + 1,
            monthCount: monthCount + 1
        }
    }
    return {
        allowed: false,
        reason: "concurrency"
    };
}
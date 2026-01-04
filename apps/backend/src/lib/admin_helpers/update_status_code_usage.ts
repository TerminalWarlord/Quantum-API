import { redis } from "@repo/redis";
import { makeUsageKeys } from "@repo/shared";
import { MetricType } from "@repo/types";

export async function updateStatusCodeUsage({
    subscription_id,
    api_id,
    status_code
}: {
    subscription_id: number,
    api_id: number,
    status_code: number
}) {
    const keys = makeUsageKeys(subscription_id, MetricType.STATUS_CODES);
    const { hourKey, dayKey } = {
        ...keys,
        hourKey: keys.hourKey + `:${status_code}:${api_id}:${subscription_id}`,
        dayKey: keys.dayKey + `:${status_code}:${api_id}:${subscription_id}`
    }
    const MAX_RETRIES = 5;
    const hourTTL = 60 * 60 * 2;
    const dayTTL = 24 * 60 * 60 * 2;
    for (let i = 0; i < MAX_RETRIES; i++) {
        const tx = redis.multi();
        tx.incrby(hourKey, 1);
        tx.incrby(dayKey, 1);
        const result = tx.exec();
        if (result === null) continue;
        const curHourTTL = await redis.ttl(hourKey);
        if (curHourTTL < 0) await redis.expire(hourKey, hourTTL);

        const curDayTTL = await redis.ttl(dayKey);
        if (curDayTTL < 0) await redis.expire(dayKey, dayTTL);
        return;
    }
}
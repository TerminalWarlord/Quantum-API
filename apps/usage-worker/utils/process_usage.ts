import { makeUsageKeys, getHourStart, getMonthStart } from "@repo/shared";
import { redis } from "@repo/redis";
import { db, usageTable } from "@repo/db/client";
import { MetricType } from "@repo/types";

interface Subscription {
    id: number;
}

export async function processUsage(subscription: Subscription) {
    const { hourKey, monthKey, currentDate } = makeUsageKeys(subscription.id, MetricType.REQUESTS);
    const [hourRaw, monthRaw] = await redis.mget(hourKey, monthKey);
    const hourCount = Number(hourRaw) || 0;
    const monthCount = Number(monthRaw) || 0;

    // Upsert hourCount
    const hourStart = getHourStart(currentDate);
    await db.insert(usageTable).values({
        subscription_id: subscription.id,
        period_start: hourStart,
        period_type: "hour",
        requests: hourCount
    }).onConflictDoUpdate({
        target: [
            usageTable.subscription_id,
            usageTable.period_start,
            usageTable.period_type
        ],
        set: {
            requests: hourCount,
            updated_at: new Date()
        }
    });

    // Upsert monthly Count
    const monthStart = getMonthStart(currentDate);
    await db.insert(usageTable).values({
        subscription_id: subscription.id,
        period_start: monthStart,
        period_type: "month",
        requests: monthCount
    }).onConflictDoUpdate({
        target: [
            usageTable.subscription_id,
            usageTable.period_start,
            usageTable.period_type
        ],
        set: {
            requests: monthCount,
            updated_at: new Date()
        }
    });
}
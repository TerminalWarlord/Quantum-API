import { db, subscriptionTable } from "@repo/db/client";
import { eq } from "drizzle-orm";
import { processUsage } from "./utils/process_usage";
import { flushRedisIntoDB } from "./flush_redis";
import { processStatusCodeUsage } from "./utils/process_status_code_usage";


// Iterate over all the items in the db (subscriptions)
async function populateUsageTable() {
    const subscriptions = await db
        .select({
            id: subscriptionTable.id,
            status: subscriptionTable.status,
            api_id: subscriptionTable.api_id
        })
        .from(subscriptionTable)
        .where(eq(subscriptionTable.status, "active"));

    if (!subscriptions || !subscriptions.length) {
        return;
    }
    await Promise.all([
        await flushRedisIntoDB(subscriptions, processUsage),
        await flushRedisIntoDB(subscriptions, processStatusCodeUsage)
    ]);
}


// (async () => populateUsageTable())()
populateUsageTable().then(_ => console.log("Populating usage"));






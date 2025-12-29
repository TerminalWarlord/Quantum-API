import { db, subscriptionTable } from "@repo/db/client";
import { eq } from "drizzle-orm";
import { processUsage } from "./utils/process_usage";


// Iterate over all the items in the db (subscriptions)
async function populateUsageTable() {
    const subscriptions = await db
        .select({
            id: subscriptionTable.id,
            status: subscriptionTable.status,
        })
        .from(subscriptionTable)
        .where(eq(subscriptionTable.status, "active"));

    if (!subscriptions || !subscriptions.length) {
        return;
    }
    const BATCH_SIZE = 20;
    for (let i = 0; i < subscriptions.length; i += BATCH_SIZE) {
        const batch = subscriptions.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (subscription) => {
            try {
                await processUsage(subscription);
            }
            catch (err) {
                console.error("Usage sync failed", {
                    subscriptionId: subscription.id,
                    err,
                });
            }
        }));
    }
}






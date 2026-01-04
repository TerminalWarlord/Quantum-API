interface Subscription {
    id: number,
    status: "active" | "canceled" | "paused" | "past_due" | "trialing" | null;
    api_id: number
}

export async function flushRedisIntoDB(subscriptions: Subscription[], callback: (subscription: Subscription) => Promise<void>) {
    const BATCH_SIZE = 20;
    for (let i = 0; i < subscriptions.length; i += BATCH_SIZE) {
        const batch = subscriptions.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (subscription) => {
            try {
                await callback(subscription);
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
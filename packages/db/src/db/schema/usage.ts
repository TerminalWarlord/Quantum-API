import { integer, pgTable, timestamp, bigint, unique } from "drizzle-orm/pg-core";
import { subscriptionTable } from "./subscriptions";
import { periodTypeEnum } from "./enums";



export const usageTable = pgTable("usages", {
    id: integer().generatedAlwaysAsIdentity().primaryKey(),
    subscription_id: integer()
        .notNull()
        .references(() => subscriptionTable.id, { onDelete: "cascade" }),
    // api_key_id: integer()
    //     .references(() => apiKeyTable.id, { onDelete: "cascade" }),
    period_type: periodTypeEnum().default("month"),
    period_start: timestamp().defaultNow(),
    requests: bigint({ mode: "number" }).default(1000),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date())
}, (t) => [
    unique("subscription_period_type_period_start_unique").on(
        t.subscription_id,
        t.period_type,
        t.period_start
    )
]);
import { integer, pgTable, timestamp, bigint } from "drizzle-orm/pg-core";
import { subscriptionTable } from "./subscriptions";
import { apiKeyTable } from "./api_keys";
import { periodTypeEnum } from "./enums";



export const usageTable = pgTable("usages", {
    id: integer().generatedAlwaysAsIdentity().primaryKey(),
    subscription_id: integer()
        .notNull()
        .references(() => subscriptionTable.id, { onDelete: "cascade" }),
    api_key_id: integer()
        .references(() => apiKeyTable.id, { onDelete: "cascade" }),
    period_type: periodTypeEnum().default("month"),
    period_start: timestamp().defaultNow(),
    requests: bigint({ mode: "number" }).default(1000),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow()
})
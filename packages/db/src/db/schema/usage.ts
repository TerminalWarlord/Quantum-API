import { integer, pgTable, timestamp, bigint } from "drizzle-orm/pg-core";
import { subsciptionTable } from "./subscriptions";
import { pgEnum } from "drizzle-orm/pg-core";
import { apiKeyTable } from "./api_keys";


export const periodTypeEnum = pgEnum("period_type", ["hour", "month"]);

export const usageTable = pgTable("usages", {
    id: integer().generatedAlwaysAsIdentity().primaryKey(),
    subscription_id: integer()
        .notNull()
        .references(() => subsciptionTable.id, { onDelete: "cascade" }),
    api_key_id: integer()
        .references(() => apiKeyTable.id, { onDelete: "cascade" }),
    period_type: periodTypeEnum().default("month"),
    period_start: timestamp().defaultNow(),
    requests: bigint({ mode: "number" }).default(1000),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow()
})
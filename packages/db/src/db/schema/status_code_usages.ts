import { integer, unique, pgTable, timestamp } from "drizzle-orm/pg-core";
import { subscriptionTable } from "./subscriptions";
import { statusCodeUsagePeriodType } from "./enums";
import { apiTable } from "./apis";

export const statusCodeUsageTable = pgTable("status_code_usages", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    subscription_id: integer()
        .notNull()
        .references(() => subscriptionTable.id, { onDelete: "cascade" }),
    api_id: integer()
        .notNull()
        .references(() => apiTable.id, { onDelete: "cascade" }),
    period_start: timestamp().defaultNow(),
    period_type: statusCodeUsagePeriodType().default("day"),
    count: integer().notNull(),
    status_code: integer().notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().$onUpdate(() => new Date())
}, (t) => [
    unique("api_subscription_period_start_period_start_status_code_unique").on(
        t.api_id,
        t.subscription_id,
        t.period_start,
        t.period_type,
        t.status_code
    )
]);
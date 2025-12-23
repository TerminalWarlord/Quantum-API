import { integer, pgTable, timestamp, text } from "drizzle-orm/pg-core";
import { userTable } from "./users";
import { apiTable } from "./apis";
import { planTable } from "./plans";
import { providers, subscriptionStatus } from "./enums";



export const subscriptionTable = pgTable("subscriptions", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer()
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
    api_id: integer()
        .notNull()
        .references(() => apiTable.id, { onDelete: "cascade" }),
    plan_id: integer()
        .notNull()
        .references(() => planTable.id, { onDelete: "cascade" }),
    provider: providers().default("paddle"),
    provider_subscription_id: text().notNull().unique(),
    status: subscriptionStatus().default("active"),
    current_period_start: timestamp().notNull(),
    current_period_end: timestamp().notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow()
})
import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./users";
import { apiTable } from "./apis";
import { planTable } from "./plans";
import { subscriptionStatus } from "./enums";



export const subsciptionTable = pgTable("subscriptions", {
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
    status: subscriptionStatus().default("active"),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow()
})
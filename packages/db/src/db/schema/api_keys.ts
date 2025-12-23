import { integer, pgTable, timestamp, text } from "drizzle-orm/pg-core";
import { subscriptionTable } from "./subscriptions";
import { apiKeyStatus } from "./enums";


export const apiKeyTable = pgTable("api_keys", {
    id: integer().generatedAlwaysAsIdentity().primaryKey(),
    subscription_id: integer()
        .notNull()
        .references(() => subscriptionTable.id, { onDelete: "cascade" }),
    key_hash: text().unique(),
    status: apiKeyStatus().default("active"),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow()
})
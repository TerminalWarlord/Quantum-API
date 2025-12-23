import { integer, pgTable, timestamp, text, bigint, varchar } from "drizzle-orm/pg-core";
import { apiTable } from "./apis";


export const planTable = pgTable("plans", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    api_id: integer()
        .notNull()
        .references(() => apiTable.id, { onDelete: "cascade" }),
    name: varchar({ length: 255 }).notNull(),
    monthly_requests: bigint({ mode: "number" }).default(10000),
    rate_limit: bigint({ mode: "number" }).default(1000),
    features: text().notNull(),
    price_in_cents: integer().notNull(),
    price_id: text().notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow()
})
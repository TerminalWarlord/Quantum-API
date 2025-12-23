import { integer, pgTable, timestamp, text, varchar } from "drizzle-orm/pg-core";
import { userTable } from "./users";
import { subscriptionTable } from "./subscriptions";
import { invoiceStatus, providers } from "./enums";



export const invoiceTable = pgTable("invoices", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    subscription_id: integer()
        .notNull()
        .references(() => subscriptionTable.id, { onDelete: "cascade" }),
    user_id: integer()
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
    amount_in_cents: integer().notNull(),
    provider: providers().default("paddle"),
    provider_invoice_id: text().notNull().unique(),
    status: invoiceStatus().default("void"),
    currency: varchar({ length: 3 }).default("USD"),
    period_start: timestamp().notNull(),
    period_end: timestamp().notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow(),
});
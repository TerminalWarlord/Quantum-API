import { integer, pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { providers, transactionStatus } from "./enums";
import { invoiceTable } from "./invoices";



export const transactionTable = pgTable("transactions", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    invoice_id: integer()
        .notNull()
        .references(() => invoiceTable.id, { onDelete: "cascade" }),
    amount_in_cents: integer().notNull(),
    provider: providers().default("paddle"),
    provider_transaction_id: text().notNull().unique(),
    status: transactionStatus().default("pending"),
    currency: varchar({ length: 3 }).default("USD"),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow(),
})
import { timestamp, integer, pgTable, text } from "drizzle-orm/pg-core";



export const categoriesTable = pgTable("categories", {
    id: integer().notNull().primaryKey().generatedByDefaultAsIdentity(),
    slug: text().notNull().unique(),
    name: text().notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow()
})
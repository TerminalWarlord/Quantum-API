import { integer, pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { userTable } from "./users";
import { categoriesTable } from "./categories";
import { apiStatus } from "./enums";


export const apiTable = pgTable("apis", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
    developer_id: integer()
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
    slug: varchar({ length: 255 }).unique().notNull(),
    category_id: integer()
        .notNull()
        .references(() => categoriesTable.id, { onDelete: 'cascade' }),
    product_id: text().notNull(),
    thumbnail_url: text(),
    base_url: text().notNull(),
    status: apiStatus().default("ENABLED"),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow(),
})
import { integer, pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { userTable } from "./users";


export const apiTable = pgTable("apis", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
    developer_id: integer()
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
    slug: varchar({ length: 255 }).unique().notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow()
})
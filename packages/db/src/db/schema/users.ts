import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";


export const userTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    first_name: varchar({length: 255}).notNull(),
    last_name: varchar({length: 255}).notNull(),
    username: varchar({length: 255}).unique().notNull(),
    password: varchar({length: 255}).notNull(),
    email: varchar({length: 255}).unique().notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow()
})
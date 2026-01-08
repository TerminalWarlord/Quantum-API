import { integer, pgTable, varchar, timestamp, text, unique } from "drizzle-orm/pg-core";
import { authProvider, userRoles } from "./enums";


export const userTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    first_name: varchar({ length: 255 }).notNull(),
    last_name: varchar({ length: 255 }),
    username: varchar({ length: 255 }).unique().notNull(),
    email: varchar({ length: 255 }).unique().notNull(),
    image: text(),
    provider: authProvider().notNull().default("credentials"),
    provider_account_id: text(),
    password: varchar({ length: 255 }),
    role: userRoles().default("USER"),
    created_at: timestamp({ withTimezone: true }).defaultNow(),
    updated_at: timestamp({ withTimezone: true }).defaultNow()
}, (t) => [
    unique("provider_provider_id_unique").on(
        t.provider,
        t.provider_account_id
    )
])
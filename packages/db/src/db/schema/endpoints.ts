import { integer, pgTable, text, varchar, timestamp, unique } from "drizzle-orm/pg-core";
import { apiTable } from "./apis";
import { endpointMethods } from "./enums";

export const endpointTable = pgTable("endpoints", {
    id: integer().notNull().primaryKey().generatedAlwaysAsIdentity(),
    api_id: integer()
        .notNull()
        .references(() => apiTable.id, { onDelete: "cascade" }),
    path: text(),
    title: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
    method: endpointMethods().default("GET"),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow(),
}, (t) => [
    unique("endpoints_api_path_method_unique").on(
        t.api_id,
        t.path,
        t.method
    )
])


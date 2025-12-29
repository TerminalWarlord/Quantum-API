import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";
import { apiTable } from "./apis";
import { userTable } from "./users";
import { unique } from "drizzle-orm/pg-core";
import { reviewStatus } from "./enums";


export const reviewTable = pgTable("reviews", {
    id: integer().generatedByDefaultAsIdentity().primaryKey(),
    content: text().notNull(),
    api_id: integer()
        .notNull()
        .references(() => apiTable.id, { onDelete: "cascade" }),
    reviewer_id: integer()
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
    rating: integer().notNull(),
    status: reviewStatus().default("PUBLISHED"),
    created_at: timestamp({ withTimezone: true }).defaultNow(),
    updated_at: timestamp({ withTimezone: true }).$onUpdate(() => new Date())
}, (t) => [
    unique("api_user_unique").on(t.api_id, t.reviewer_id),
]);
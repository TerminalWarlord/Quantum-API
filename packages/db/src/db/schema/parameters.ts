import { integer, pgTable } from "drizzle-orm/pg-core";
import { endpointTable } from "./endpoints";
import { text } from "drizzle-orm/pg-core";
import { parameterLocations, parameterTypes } from "./enums";
import { boolean } from "drizzle-orm/pg-core";

export const parameterTable = pgTable("parameters", {
    id: integer().notNull().primaryKey().generatedAlwaysAsIdentity(),
    endpoint_id: integer()
        .notNull()
        .references(() => endpointTable.id, { onDelete: "cascade" }),
    name: text().notNull(),
    location: parameterLocations().default("QUERY"),
    is_required: boolean().notNull(),
    value: text().notNull(),
    default_value: text().notNull(),
    type: parameterTypes().default("STRING")
})
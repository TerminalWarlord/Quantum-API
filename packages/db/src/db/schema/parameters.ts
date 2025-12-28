import { integer, pgTable, text, boolean } from "drizzle-orm/pg-core";
import { endpointTable } from "./endpoints";
import { parameterLocations, parameterTypes } from "./enums";

export const parameterTable = pgTable("parameters", {
    id: integer().notNull().primaryKey().generatedAlwaysAsIdentity(),
    endpoint_id: integer()
        .notNull()
        .references(() => endpointTable.id, { onDelete: "cascade" }),
    name: text().notNull(),
    location: parameterLocations().default("QUERY"),
    is_required: boolean().notNull(),
    default_value: text().notNull(),
    type: parameterTypes().default("STRING")
})
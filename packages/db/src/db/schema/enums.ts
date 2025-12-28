import { pgEnum } from "drizzle-orm/pg-core";

export const apiKeyStatus = pgEnum("api_key_status", ["active", "revoked"]);
export const subscriptionStatus = pgEnum("subscription_status", ["active", "canceled", "paused", "past_due", "trialing"]);
export const periodTypeEnum = pgEnum("period_type", ["hour", "month"]);
export const invoiceStatus = pgEnum("invoice_status", ["open", "paid", "void"]);
export const transactionStatus = pgEnum("transaction_status", ["completed", "failed", "pending"]);
export const providers = pgEnum("provider", ["paddle", "dodo", "crypto"]);
export const endpointMethods = pgEnum("endpoint_methods", ["GET", "POST", "PATCH", "DELETE", "PUT"]);
export const parameterTypes = pgEnum("parameter_types", ["STRING", "NUMBER", "BOOLEAN", "OBJECT"]);
export const parameterLocations = pgEnum("parameter_locations", ["QUERY", "BODY", "HEADER"]);
export const userRoles = pgEnum("user_roles", ["ADMIN", "MOD", "USER"]);
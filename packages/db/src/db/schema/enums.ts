import { pgEnum } from "drizzle-orm/pg-core";

export const apiKeyStatus = pgEnum("api_key_status", ["active", "revoked"]);
export const subscriptionStatus = pgEnum("subscription_status", ["active", "canceled", "paused", "past_due", "trialing"]);
export const periodTypeEnum = pgEnum("period_type", ["hour", "month"]);
export const invoiceStatus = pgEnum("invoice_status", ["open", "paid", "void"]);
export const transactionStatus = pgEnum("transaction_status", ["completed", "failed", "pending"]);
export const providers = pgEnum("payment_provider", ["paddle", "dodo", "crypto"]);
export const endpointMethods = pgEnum("endpoint_method", ["GET", "POST", "PATCH", "DELETE", "PUT"]);
export const parameterTypes = pgEnum("parameter_type", ["STRING", "NUMBER", "BOOLEAN", "OBJECT"]);
export const parameterLocations = pgEnum("parameter_location", ["QUERY", "BODY", "HEADER"]);
export const userRoles = pgEnum("user_roles", ["ADMIN", "MOD", "USER"]);
export const reviewStatus = pgEnum("review_status", ["PENDING", "PUBLISHED", "DELETED"]);
export const statusCodeUsagePeriodType = pgEnum("status_code_usage_period_type", ["hour", "day"]);
export const apiStatus = pgEnum("api_status", ["ENABLED", "DISABLED"]);
export const authProvider = pgEnum("auth_provider", ["google", "github", "credentials"]);
export const userStatus = pgEnum("user_status", ["BANNED", "ACTIVE"]);
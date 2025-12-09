import { pgEnum } from "drizzle-orm/pg-core";

export const apiKeyStatus = pgEnum("api_key_status", ["active", "revoked"]);
export const subscriptionStatus = pgEnum("subscription_status", ["active", "cancelled"]);
export const periodTypeEnum = pgEnum("period_type", ["hour", "month"]);
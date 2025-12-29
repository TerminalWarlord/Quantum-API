ALTER TABLE "usages" DROP CONSTRAINT "subscription_api_key_period_type_period_start_unique";--> statement-breakpoint
ALTER TABLE "usages" DROP CONSTRAINT "usages_api_key_id_api_keys_id_fk";
--> statement-breakpoint
ALTER TABLE "usages" DROP COLUMN "api_key_id";--> statement-breakpoint
ALTER TABLE "usages" ADD CONSTRAINT "subscription_period_type_period_start_unique" UNIQUE("subscription_id","period_type","period_start");
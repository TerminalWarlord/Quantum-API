CREATE TYPE "public"."api_status" AS ENUM('ENABLED', 'DISABLED');--> statement-breakpoint
CREATE TYPE "public"."status_code_usage_period_type" AS ENUM('hour', 'day');--> statement-breakpoint
CREATE TABLE "status_code_usage" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "status_code_usage_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"subscription_id" integer NOT NULL,
	"api_id" integer NOT NULL,
	"period_start" timestamp DEFAULT now(),
	"period_type" "status_code_usage_period_type" DEFAULT 'day',
	"count" integer NOT NULL,
	"status_code" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "apis" ADD COLUMN "status" "api_status" DEFAULT 'ENABLED';--> statement-breakpoint
ALTER TABLE "status_code_usage" ADD CONSTRAINT "status_code_usage_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_code_usage" ADD CONSTRAINT "status_code_usage_api_id_apis_id_fk" FOREIGN KEY ("api_id") REFERENCES "public"."apis"("id") ON DELETE cascade ON UPDATE no action;
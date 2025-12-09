CREATE TYPE "public"."api_key_status" AS ENUM('active', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."period_type" AS ENUM('hour', 'month');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'cancelled');--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "api_keys_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"subsciption_id" integer NOT NULL,
	"key_hash" text,
	"status" "api_key_status" DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "api_keys_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
CREATE TABLE "apis" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "apis_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"developer_id" integer NOT NULL,
	"slug" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "apis_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "plans_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"api_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"monthly_requests" bigint DEFAULT 10000,
	"rate_limit" bigint DEFAULT 1000,
	"features" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "subscriptions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"api_id" integer NOT NULL,
	"plan_id" integer NOT NULL,
	"status" "subscription_status" DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "usages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "usages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"subscription_id" integer NOT NULL,
	"api_key_id" integer,
	"period_type" "period_type" DEFAULT 'month',
	"period_start" timestamp DEFAULT now(),
	"requests" bigint DEFAULT 1000,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_subsciption_id_subscriptions_id_fk" FOREIGN KEY ("subsciption_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apis" ADD CONSTRAINT "apis_developer_id_users_id_fk" FOREIGN KEY ("developer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_api_id_apis_id_fk" FOREIGN KEY ("api_id") REFERENCES "public"."apis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_api_id_apis_id_fk" FOREIGN KEY ("api_id") REFERENCES "public"."apis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usages" ADD CONSTRAINT "usages_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usages" ADD CONSTRAINT "usages_api_key_id_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."api_keys"("id") ON DELETE cascade ON UPDATE no action;
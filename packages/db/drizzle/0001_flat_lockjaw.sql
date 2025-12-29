CREATE TYPE "public"."user_roles" AS ENUM('ADMIN', 'MOD', 'USER');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_roles" DEFAULT 'USER';
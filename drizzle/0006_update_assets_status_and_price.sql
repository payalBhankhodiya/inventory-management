CREATE TYPE "public"."asset_status" AS ENUM('AVAILABLE', 'ASSIGNED', 'IN_MAINTENANCE', 'LOST', 'DAMAGED', 'DISPOSED');--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE'::"public"."asset_status";--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "status" SET DATA TYPE "public"."asset_status" USING "status"::"public"."asset_status";--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "purchase_price" SET DATA TYPE numeric(12, 2);
CREATE TYPE "public"."location_type" AS ENUM(
  'WAREHOUSE',
  'STORAGE_ROOM',
  'RACK',
  'SHELF',
  'CABINET',
  'BIN'
);

--> statement-breakpoint

ALTER TABLE "locations"
ADD COLUMN "type" "location_type";

--> statement-breakpoint

ALTER TABLE "locations"
ADD COLUMN "parent_location_id" uuid;

--> statement-breakpoint

ALTER TABLE "locations"
ADD COLUMN "description" text;

--> statement-breakpoint

UPDATE "locations"
SET "type" = 'WAREHOUSE'
WHERE "type" IS NULL;

--> statement-breakpoint

ALTER TABLE "locations"
ALTER COLUMN "type" SET NOT NULL;

--> statement-breakpoint

ALTER TABLE "locations"
ADD CONSTRAINT "locations_parent_location_id_fk"
FOREIGN KEY ("parent_location_id")
REFERENCES "public"."locations"("id")
ON DELETE SET NULL
ON UPDATE NO ACTION;

--> statement-breakpoint

ALTER TABLE "locations" DROP COLUMN "address";

--> statement-breakpoint

ALTER TABLE "locations" DROP COLUMN "city";

--> statement-breakpoint

ALTER TABLE "locations" DROP COLUMN "state";

--> statement-breakpoint

ALTER TABLE "locations" DROP COLUMN "country";
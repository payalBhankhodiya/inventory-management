ALTER TABLE "categories"
ALTER COLUMN "description" SET DATA TYPE text;

--> statement-breakpoint

ALTER TABLE "categories"
ADD COLUMN "parent_category_id" uuid;

--> statement-breakpoint

ALTER TABLE "categories"
ADD CONSTRAINT "categories_parent_category_id_fk"
FOREIGN KEY ("parent_category_id")
REFERENCES "public"."categories"("id")
ON DELETE SET NULL
ON UPDATE NO ACTION;
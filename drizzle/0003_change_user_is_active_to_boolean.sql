ALTER TABLE "users"
ALTER COLUMN "is_active"
DROP DEFAULT;

--> statement-breakpoint

ALTER TABLE "users"
ALTER COLUMN "is_active"
SET DATA TYPE boolean
USING CASE
  WHEN "is_active" = 'ACTIVE' THEN true
  WHEN "is_active" = 'INACTIVE' THEN false
  ELSE true
END;

--> statement-breakpoint

ALTER TABLE "users"
ALTER COLUMN "is_active"
SET DEFAULT true;
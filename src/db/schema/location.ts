import { pgTable, pgEnum, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const locationTypeEnum = pgEnum("location_type", [
  "WAREHOUSE",
  "STORAGE_ROOM",
  "RACK",
  "SHELF",
  "CABINET",
  "BIN",
]);

export const locations = pgTable("locations", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 100 }).notNull(),

  code: varchar("code", { length: 50 }).notNull().unique(),

  type: locationTypeEnum("type").notNull(),

  parentLocationId: uuid("parent_location_id"),

  description: text("description"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

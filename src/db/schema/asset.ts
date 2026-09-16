import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

import { items } from "./item.js";
import { locations } from "./location.js";

export const assetStatusEnum = pgEnum("asset_status", [
  "AVAILABLE",
  "ASSIGNED",
  "IN_MAINTENANCE",
  "LOST",
  "DAMAGED",
  "DISPOSED",
]);

export const assets = pgTable("assets", {
  id: uuid("id").defaultRandom().primaryKey(),

  assetTag: varchar("asset_tag", { length: 100 })
    .notNull()
    .unique(),

  itemId: uuid("item_id")
    .notNull()
    .references(() => items.id),

  serialNumber: varchar("serial_number", {
    length: 150,
  }).unique(),

  status: assetStatusEnum("status")
    .notNull()
    .default("AVAILABLE"),

  locationId: uuid("location_id")
    .references(() => locations.id),

  purchasePrice: numeric("purchase_price", {
    precision: 12,
    scale: 2,
  }),

  notes: text("notes"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});
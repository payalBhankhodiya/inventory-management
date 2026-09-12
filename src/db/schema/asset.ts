import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { items } from "./item";
import { locations } from "./location";

export const assets = pgTable("assets", {
  id: uuid("id").defaultRandom().primaryKey(),

  assetTag: varchar("asset_tag", { length: 100 })
    .notNull()
    .unique(),

  itemId: uuid("item_id")
    .notNull()
    .references(() => items.id),

  serialNumber: varchar("serial_number", { length: 150 })
    .unique(),

  status: varchar("status", { length: 30 })
    .notNull()
    .default("AVAILABLE"),

  locationId: uuid("location_id")
    .references(() => locations.id),

  purchasePrice: varchar("purchase_price", { length: 50 }),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";

import { assets } from "./asset";
import { locations } from "./location";
import { users } from "./user";

export const transfers = pgTable("transfers", {
  id: uuid("id").defaultRandom().primaryKey(),

  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id),

  fromLocationId: uuid("from_location_id")
    .notNull()
    .references(() => locations.id),

  toLocationId: uuid("to_location_id")
    .notNull()
    .references(() => locations.id),

  transferredBy: uuid("transferred_by")
    .notNull()
    .references(() => users.id),

  transferredAt: timestamp("transferred_at").defaultNow().notNull(),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

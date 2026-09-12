import { pgTable, uuid, timestamp, text, varchar } from "drizzle-orm/pg-core";

import { assets } from "./asset";
import { users } from "./user";

export const returns = pgTable("returns", {
  id: uuid("id").defaultRandom().primaryKey(),

  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id),

  returnedBy: uuid("returned_by")
    .notNull()
    .references(() => users.id),

  receivedBy: uuid("received_by")
    .notNull()
    .references(() => users.id),

  returnedAt: timestamp("returned_at").defaultNow().notNull(),

  condition: varchar("condition", {
    length: 30,
  }).notNull(),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

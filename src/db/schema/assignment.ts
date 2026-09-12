import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";

import { assets } from "./asset";
import { users } from "./user";

export const assignments = pgTable("assignments", {
  id: uuid("id").defaultRandom().primaryKey(),

  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),

  assignedBy: uuid("assigned_by")
    .notNull()
    .references(() => users.id),

  assignedAt: timestamp("assigned_at").defaultNow().notNull(),

  returnedAt: timestamp("returned_at"),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

import { assets } from "./asset";
import { users } from "./user";

export const disposals = pgTable("disposals", {
  id: uuid("id").defaultRandom().primaryKey(),

  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id),

  disposedBy: uuid("disposed_by")
    .notNull()
    .references(() => users.id),

  reason: text("reason").notNull(),

  method: varchar("method", { length: 50 }),

  disposedAt: timestamp("disposed_at").defaultNow().notNull(),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

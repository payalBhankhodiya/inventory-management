import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

import { assets } from "./asset";
import { users } from "./user";

export const maintenance = pgTable("maintenance", {
  id: uuid("id").defaultRandom().primaryKey(),

  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id),

  reportedBy: uuid("reported_by")
    .notNull()
    .references(() => users.id),

  issue: text("issue").notNull(),

  status: varchar("status", { length: 30 }).notNull().default("OPEN"),

  cost: numeric("cost", {
    precision: 12,
    scale: 2,
  }),

  startedAt: timestamp("started_at"),

  completedAt: timestamp("completed_at"),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

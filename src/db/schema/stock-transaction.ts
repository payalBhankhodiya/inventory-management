import {
  pgTable,
  uuid,
  integer,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { items } from "./item";
import { locations } from "./location";
import { users } from "./user";

export const stockTransactions = pgTable("stock_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),

  itemId: uuid("item_id")
    .notNull()
    .references(() => items.id),

  locationId: uuid("location_id")
    .notNull()
    .references(() => locations.id),

  type: varchar("type", { length: 30 }).notNull(),

  quantity: integer("quantity").notNull(),

  performedBy: uuid("performed_by")
    .notNull()
    .references(() => users.id),

  referenceId: uuid("reference_id"),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

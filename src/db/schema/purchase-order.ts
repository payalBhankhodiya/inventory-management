import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { vendors } from "./vendor";
import { users } from "./user";

export const purchaseOrders = pgTable("purchase_orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderNumber: varchar("order_number", { length: 100 })
    .notNull()
    .unique(),

  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendors.id),

  status: varchar("status", { length: 30 })
    .notNull()
    .default("DRAFT"),

  orderedBy: uuid("ordered_by")
    .notNull()
    .references(() => users.id),

  orderDate: timestamp("order_date").defaultNow().notNull(),

  expectedDate: timestamp("expected_date"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
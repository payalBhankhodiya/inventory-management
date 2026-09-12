import {
  pgTable,
  uuid,
  integer,
  varchar,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

import { purchaseOrders } from "./purchase-order";
import { items } from "./item";

export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  purchaseOrderId: uuid("purchase_order_id")
    .notNull()
    .references(() => purchaseOrders.id, {
      onDelete: "cascade",
    }),

  itemId: uuid("item_id")
    .notNull()
    .references(() => items.id),

  orderedQuantity: integer("ordered_quantity").notNull(),

  receivedQuantity: integer("received_quantity").notNull().default(0),

  unitPrice: numeric("unit_price", {
    precision: 12,
    scale: 2,
  }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

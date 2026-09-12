import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { purchaseOrders } from "./purchase-order";
import { users } from "./user";

export const purchaseReceipts = pgTable("purchase_receipts", {
  id: uuid("id").defaultRandom().primaryKey(),

  receiptNumber: varchar("receipt_number", { length: 100 })
    .notNull()
    .unique(),

  purchaseOrderId: uuid("purchase_order_id")
    .notNull()
    .references(() => purchaseOrders.id),

  receivedBy: uuid("received_by")
    .notNull()
    .references(() => users.id),

  receivedAt: timestamp("received_at").defaultNow().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
import { pgTable, uuid, integer, timestamp } from "drizzle-orm/pg-core";

import { purchaseReceipts } from "./purchase-receipt";
import { items } from "./item";
import { locations } from "./location";

export const purchaseReceiptItems = pgTable("purchase_receipt_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  receiptId: uuid("receipt_id")
    .notNull()
    .references(() => purchaseReceipts.id, {
      onDelete: "cascade",
    }),

  itemId: uuid("item_id")
    .notNull()
    .references(() => items.id),

  quantity: integer("quantity").notNull(),

  locationId: uuid("location_id")
    .notNull()
    .references(() => locations.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

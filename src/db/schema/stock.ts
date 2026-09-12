import { pgTable, uuid, integer, timestamp } from "drizzle-orm/pg-core";

import { items } from "./item";
import { locations } from "./location";

export const stock = pgTable("stock", {
  id: uuid("id").defaultRandom().primaryKey(),

  itemId: uuid("item_id")
    .notNull()
    .references(() => items.id),

  locationId: uuid("location_id")
    .notNull()
    .references(() => locations.id),

  quantity: integer("quantity").notNull().default(0),

  minimumQuantity: integer("minimum_quantity").notNull().default(0),

  maximumQuantity: integer("maximum_quantity"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

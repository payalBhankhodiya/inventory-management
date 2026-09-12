import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

import { categories } from "./category";

export const items = pgTable("items", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 150 }).notNull(),

  sku: varchar("sku", { length: 100 }).notNull().unique(),

  description: text("description"),

  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),

  manufacturer: varchar("manufacturer", { length: 100 }),

  model: varchar("model", { length: 100 }),

  isAsset: boolean("is_asset").notNull().default(true),

  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
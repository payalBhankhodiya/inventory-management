import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const vendors = pgTable("vendors", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 150 }).notNull(),

  code: varchar("code", { length: 50 }).notNull().unique(),

  email: varchar("email", { length: 255 }),

  phone: varchar("phone", { length: 30 }),

  address: text("address"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

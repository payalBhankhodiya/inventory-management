import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./user";

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  title: varchar("title", { length: 150 }).notNull(),

  message: text("message").notNull(),

  type: varchar("type", { length: 50 }),

  isRead: boolean("is_read").notNull().default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

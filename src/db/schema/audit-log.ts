import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

import { users } from "./user";

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id").references(() => users.id),

  action: varchar("action", { length: 100 }).notNull(),

  entityType: varchar("entity_type", {
    length: 100,
  }).notNull(),

  entityId: uuid("entity_id"),

  oldData: jsonb("old_data"),

  newData: jsonb("new_data"),

  ipAddress: varchar("ip_address", {
    length: 50,
  }),

  description: text("description"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

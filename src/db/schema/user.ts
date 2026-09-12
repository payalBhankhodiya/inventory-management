import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

import { roles } from "./role.js";
import { departments } from "./department.js";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 100 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  password: varchar("password", { length: 255 }).notNull(),

  roleId: uuid("role_id")
    .notNull()
    .references(() => roles.id),

  departmentId: uuid("department_id")
    .references(() => departments.id),

  isActive: boolean("is_active")
    .notNull()
    .default(true),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});
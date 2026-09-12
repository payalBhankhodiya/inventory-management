import { db } from "../db/index.js";
import { permissions } from "../db/schema/permission.js";

const permissionList = [
  "users.read",
  "users.create",
  "users.update",
  "users.delete",

  "departments.read",
  "departments.create",
  "departments.update",
  "departments.delete",

  "locations.read",
  "locations.create",
  "locations.update",
  "locations.delete",

  "categories.read",
  "categories.create",
  "categories.update",
  "categories.delete",

  "items.read",
  "items.create",
  "items.update",
  "items.delete",

  "assets.read",
  "assets.create",
  "assets.update",
  "assets.delete",

  "stock.read",
  "stock.create",
  "stock.update",

  "vendors.read",
  "vendors.create",
  "vendors.update",
  "vendors.delete",

  "purchase_orders.read",
  "purchase_orders.create",
  "purchase_orders.update",
  "purchase_orders.approve",

  "purchase_receipts.read",
  "purchase_receipts.create",

  "maintenance.read",
  "maintenance.create",
  "maintenance.update",

  "disposals.read",
  "disposals.create",
  "disposals.approve",

  "audit_logs.read",

  "notifications.read",
];

export const seedPermissions = async () => {
  await db
    .insert(permissions)
    .values(
      permissionList.map((name) => ({
        name,
        description: `Permission to ${name.replace(".", " ")}`,
      })),
    )
    .onConflictDoNothing();
};

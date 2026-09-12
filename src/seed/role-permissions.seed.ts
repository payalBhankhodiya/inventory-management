import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { permissions } from "../db/schema/permission.js";
import { rolePermissions } from "../db/schema/role-permission.js";
import { roles } from "../db/schema/role.js";

export const seedRolePermissions = async () => {
  const allRoles = await db.select().from(roles);
  const allPermissions = await db.select().from(permissions);

  const roleMap = new Map(
    allRoles.map((role) => [role.name, role.id]),
  );

  const permissionMap = new Map(
    allPermissions.map((permission) => [
      permission.name,
      permission.id,
    ]),
  );

  const rolePermissionsMap: Record<string, string[]> = {
    ADMIN: allPermissions.map((permission) => permission.name),

    INVENTORY_MANAGER: [
      "departments.read",
      "locations.read",
      "categories.read",
      "categories.create",
      "categories.update",
      "items.read",
      "items.create",
      "items.update",
      "assets.read",
      "assets.create",
      "assets.update",
      "stock.read",
      "stock.create",
      "stock.update",
      "vendors.read",
      "vendors.create",
      "vendors.update",
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
      "audit_logs.read",
      "notifications.read",
    ],

    DEPARTMENT_MANAGER: [
      "users.read",
      "departments.read",
      "locations.read",
      "categories.read",
      "items.read",
      "assets.read",
      "stock.read",
      "purchase_orders.read",
      "purchase_receipts.read",
      "maintenance.read",
      "maintenance.create",
      "notifications.read",
    ],

    EMPLOYEE: [
      "items.read",
      "assets.read",
      "stock.read",
      "maintenance.read",
      "notifications.read",
    ],
  };

  for (const [roleName, permissionNames] of Object.entries(
    rolePermissionsMap,
  )) {
    const roleId = roleMap.get(roleName);

    if (!roleId) {
      throw new Error(`Role not found: ${roleName}`);
    }

    for (const permissionName of permissionNames) {
      const permissionId = permissionMap.get(permissionName);

      if (!permissionId) {
        throw new Error(
          `Permission not found: ${permissionName}`,
        );
      }

      await db
        .insert(rolePermissions)
        .values({
          roleId,
          permissionId,
        })
        .onConflictDoNothing();
    }
  }
};
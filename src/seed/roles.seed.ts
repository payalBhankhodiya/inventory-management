import { db } from "../db/index.js";
import { roles } from "../db/schema/role.js";

export const seedRoles = async () => {
  await db
    .insert(roles)
    .values([
      {
        name: "ADMIN",
        description: "Full system access",
      },
      {
        name: "INVENTORY_MANAGER",
        description: "Manages inventory and assets",
      },
      {
        name: "DEPARTMENT_MANAGER",
        description: "Manages department inventory",
      },
      {
        name: "EMPLOYEE",
        description: "Regular inventory user",
      },
    ])
    .onConflictDoNothing();
};

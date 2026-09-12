import { seedPermissions } from "./permissions.seed.js";
import { seedRolePermissions } from "./role-permissions.seed.js";
import { seedRoles } from "./roles.seed.js";



const seed = async () => {
  try {
    console.log("Starting database seeding...");

    await seedRoles();
    console.log("Roles seeded successfully.");

    await seedPermissions();
    console.log("Permissions seeded successfully.");

    await seedRolePermissions();
    console.log("Role-permissions seeded successfully.");

    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  }
};

seed();
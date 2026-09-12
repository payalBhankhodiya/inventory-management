import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { departments } from "../db/schema/department.js";

import type {
  DepartmentCreateInput,
  DepartmentUpdateInput,
} from "../validations/department.validation.js";

export const createDepartment = async (
  input: DepartmentCreateInput,
) => {
  const existingDepartment = await db
    .select({
      id: departments.id,
    })
    .from(departments)
    .where(eq(departments.code, input.code))
    .limit(1);

  if (existingDepartment.length > 0) {
    throw new Error(
      "Department with this code already exists",
    );
  }

  const [department] = await db
    .insert(departments)
    .values({
      name: input.name,
      code: input.code,
      description: input.description,
    })
    .returning();

  if (!department) {
    throw new Error("Failed to create department");
  }

  return department;
};

export const getDepartments = async () => {
  return db
    .select()
    .from(departments)
    .orderBy(departments.name);
};

export const getDepartmentById = async (id: string) => {
  const [department] = await db
    .select()
    .from(departments)
    .where(eq(departments.id, id))
    .limit(1);

  if (!department) {
    throw new Error("Department not found");
  }

  return department;
};

export const updateDepartment = async (
  id: string,
  input: DepartmentUpdateInput,
) => {
  const existingDepartment = await db
    .select({
      id: departments.id,
    })
    .from(departments)
    .where(eq(departments.id, id))
    .limit(1);

  if (existingDepartment.length === 0) {
    throw new Error("Department not found");
  }

  if (input.code) {
    const duplicateDepartment = await db
      .select({
        id: departments.id,
      })
      .from(departments)
      .where(eq(departments.code, input.code))
      .limit(1);

    if (
      duplicateDepartment.length > 0 &&
      duplicateDepartment[0]?.id !== id
    ) {
      throw new Error(
        "Department with this code already exists",
      );
    }
  }

  const [department] = await db
    .update(departments)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(departments.id, id))
    .returning();

  if (!department) {
    throw new Error("Failed to update department");
  }

  return department;
};

export const deleteDepartment = async (id: string) => {
  const existingDepartment = await db
    .select({
      id: departments.id,
    })
    .from(departments)
    .where(eq(departments.id, id))
    .limit(1);

  if (existingDepartment.length === 0) {
    throw new Error("Department not found");
  }

  await db
    .delete(departments)
    .where(eq(departments.id, id));

  return {
    message: "Department deleted successfully",
  };
};


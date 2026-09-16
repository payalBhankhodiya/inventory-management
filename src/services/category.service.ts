import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { categories } from "../db/schema/category.js";

import type {
  CategoryCreateInput,
  CategoryUpdateInput,
} from "../validations/category.validation.js";

export const createCategory = async (
  input: CategoryCreateInput,
) => {
  // Check duplicate category name
  const [existingCategory] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.name, input.name))
    .limit(1);

  if (existingCategory) {
    throw new Error(
      "Category with this name already exists",
    );
  }

  // Validate parent category
  if (input.parentCategoryId) {
    const [parentCategory] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(
        eq(categories.id, input.parentCategoryId),
      )
      .limit(1);

    if (!parentCategory) {
      throw new Error("Parent category not found");
    }
  }

  const [category] = await db
    .insert(categories)
    .values({
      name: input.name,
      parentCategoryId:
        input.parentCategoryId ?? null,
      description: input.description ?? null,
    })
    .returning();

  if (!category) {
    throw new Error("Failed to create category");
  }

  return category;
};

export const getCategories = async () => {
  return db
    .select()
    .from(categories)
    .orderBy(categories.name);
};

export const getCategoryById = async (
  id: string,
) => {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

export const updateCategory = async (
  id: string,
  input: CategoryUpdateInput,
) => {
  const [existingCategory] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  // Check duplicate name
  if (input.name) {
    const [duplicateCategory] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.name, input.name))
      .limit(1);

    if (
      duplicateCategory &&
      duplicateCategory.id !== id
    ) {
      throw new Error(
        "Category with this name already exists",
      );
    }
  }

  // Validate parent category
  if (input.parentCategoryId) {
    if (input.parentCategoryId === id) {
      throw new Error(
        "Category cannot be its own parent",
      );
    }

    const [parentCategory] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(
        eq(categories.id, input.parentCategoryId),
      )
      .limit(1);

    if (!parentCategory) {
      throw new Error("Parent category not found");
    }
  }

  const [category] = await db
    .update(categories)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, id))
    .returning();

  if (!category) {
    throw new Error("Failed to update category");
  }

  return category;
};

export const deleteCategory = async (
  id: string,
) => {
  const [existingCategory] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  await db
    .delete(categories)
    .where(eq(categories.id, id));

  return {
    message: "Category deleted successfully",
  };
};
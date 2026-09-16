import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { categories } from "../db/schema/category.js";
import { items } from "../db/schema/item.js";

import type {
  ItemCreateInput,
  ItemUpdateInput,
} from "../validations/item.validation.js";

export const createItem = async (
  input: ItemCreateInput,
) => {
  // Check duplicate SKU
  const [existingSku] = await db
    .select({ id: items.id })
    .from(items)
    .where(eq(items.sku, input.sku))
    .limit(1);

  if (existingSku) {
    throw new Error(
      "Item with this SKU already exists",
    );
  }

  // Validate category
  const [category] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.id, input.categoryId))
    .limit(1);

  if (!category) {
    throw new Error("Category not found");
  }

  const [item] = await db
    .insert(items)
    .values({
      name: input.name,
      sku: input.sku,
      description: input.description ?? null,
      categoryId: input.categoryId,
      manufacturer: input.manufacturer ?? null,
      model: input.model ?? null,
      isAsset: input.isAsset,
      isActive: input.isActive,
    })
    .returning();

  if (!item) {
    throw new Error("Failed to create item");
  }

  return item;
};

export const getItems = async () => {
  return db
    .select()
    .from(items)
    .orderBy(items.name);
};

export const getItemById = async (
  id: string,
) => {
  const [item] = await db
    .select()
    .from(items)
    .where(eq(items.id, id))
    .limit(1);

  if (!item) {
    throw new Error("Item not found");
  }

  return item;
};

export const updateItem = async (
  id: string,
  input: ItemUpdateInput,
) => {
  const [existingItem] = await db
    .select({ id: items.id })
    .from(items)
    .where(eq(items.id, id))
    .limit(1);

  if (!existingItem) {
    throw new Error("Item not found");
  }

  // Check duplicate SKU
  if (input.sku) {
    const [duplicateSku] = await db
      .select({ id: items.id })
      .from(items)
      .where(eq(items.sku, input.sku))
      .limit(1);

    if (
      duplicateSku &&
      duplicateSku.id !== id
    ) {
      throw new Error(
        "Item with this SKU already exists",
      );
    }
  }

  // Validate category
  if (input.categoryId) {
    const [category] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(
        eq(categories.id, input.categoryId),
      )
      .limit(1);

    if (!category) {
      throw new Error("Category not found");
    }
  }

  const [item] = await db
    .update(items)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(items.id, id))
    .returning();

  if (!item) {
    throw new Error("Failed to update item");
  }

  return item;
};

export const deleteItem = async (
  id: string,
) => {
  const [existingItem] = await db
    .select({ id: items.id })
    .from(items)
    .where(eq(items.id, id))
    .limit(1);

  if (!existingItem) {
    throw new Error("Item not found");
  }

  await db
    .delete(items)
    .where(eq(items.id, id));

  return {
    message: "Item deleted successfully",
  };
};
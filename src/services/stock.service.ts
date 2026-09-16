import { and, eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { stock } from "../db/schema/stock.js";
import { items } from "../db/schema/item.js";
import { locations } from "../db/schema/location.js";

import type {
  CreateStockInput,
  UpdateStockInput,
} from "../validations/stock.validation.js";

export const createStock = async (input: CreateStockInput) => {
  // Check item exists
  const [item] = await db
    .select({ id: items.id })
    .from(items)
    .where(eq(items.id, input.itemId))
    .limit(1);

  if (!item) {
    throw new Error("Item not found");
  }

  // Check location exists
  const [location] = await db
    .select({ id: locations.id })
    .from(locations)
    .where(eq(locations.id, input.locationId))
    .limit(1);

  if (!location) {
    throw new Error("Location not found");
  }

  // Check whether stock already exists for this item/location
  const [existingStock] = await db
    .select({ id: stock.id })
    .from(stock)
    .where(
      and(
        eq(stock.itemId, input.itemId),
        eq(stock.locationId, input.locationId),
      ),
    )
    .limit(1);

  if (existingStock) {
    throw new Error("Stock already exists for this item at this location");
  }

  // Validate maximum quantity
  if (
    input.maximumQuantity !== undefined &&
    input.maximumQuantity < input.minimumQuantity
  ) {
    throw new Error(
      "Maximum quantity must be greater than or equal to minimum quantity",
    );
  }

  const [stockRecord] = await db
    .insert(stock)
    .values({
      itemId: input.itemId,
      locationId: input.locationId,
      quantity: input.quantity,
      minimumQuantity: input.minimumQuantity,
      maximumQuantity: input.maximumQuantity,
    })
    .returning();

  if (!stockRecord) {
    throw new Error("Failed to create stock");
  }

  return stockRecord;
};

export const getStocks = async () => {
  return db.select().from(stock);
};

export const getStockById = async (id: string) => {
  const [stockRecord] = await db
    .select()
    .from(stock)
    .where(eq(stock.id, id))
    .limit(1);

  if (!stockRecord) {
    throw new Error("Stock not found");
  }

  return stockRecord;
};

export const updateStock = async (id: string, input: UpdateStockInput) => {
  const existingStock = await getStockById(id);

  const newLocationId = input.locationId ?? existingStock.locationId;

  // Check new location exists
  if (input.locationId) {
    const [location] = await db
      .select({ id: locations.id })
      .from(locations)
      .where(eq(locations.id, input.locationId))
      .limit(1);

    if (!location) {
      throw new Error("Location not found");
    }
  }

  // Prevent duplicate item/location combination
  if (input.locationId) {
    const [duplicateStock] = await db
      .select({ id: stock.id })
      .from(stock)
      .where(
        and(
          eq(stock.itemId, existingStock.itemId),
          eq(stock.locationId, newLocationId),
        ),
      )
      .limit(1);

    if (duplicateStock && duplicateStock.id !== id) {
      throw new Error("Stock already exists for this item at this location");
    }
  }

  // Validate maximum against existing minimum
  const newMinimumQuantity =
    input.minimumQuantity ?? existingStock.minimumQuantity;

  if (
    input.maximumQuantity !== undefined &&
    input.maximumQuantity < newMinimumQuantity
  ) {
    throw new Error(
      "Maximum quantity must be greater than or equal to minimum quantity",
    );
  }

  // Also validate existing maximum if minimum is increased
  const newMaximumQuantity =
    input.maximumQuantity ?? existingStock.maximumQuantity;

  if (newMaximumQuantity !== null && newMaximumQuantity < newMinimumQuantity) {
    throw new Error(
      "Maximum quantity must be greater than or equal to minimum quantity",
    );
  }

  const [updatedStock] = await db
    .update(stock)
    .set({
      ...(input.locationId !== undefined && {
        locationId: input.locationId,
      }),
      ...(input.minimumQuantity !== undefined && {
        minimumQuantity: input.minimumQuantity,
      }),
      ...(input.maximumQuantity !== undefined && {
        maximumQuantity: input.maximumQuantity,
      }),
      updatedAt: new Date(),
    })
    .where(eq(stock.id, id))
    .returning();

  if (!updatedStock) {
    throw new Error("Stock not found or update failed");
  }

  return updatedStock;
};

export const deleteStock = async (id: string) => {
  const existingStock = await getStockById(id);

  if (existingStock.quantity !== 0) {
    throw new Error("Stock with available quantity cannot be deleted");
  }

  await db.delete(stock).where(eq(stock.id, id));

  return {
    message: "Stock deleted successfully",
  };
};

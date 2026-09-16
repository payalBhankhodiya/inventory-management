import { and, eq, ne } from "drizzle-orm";

import { db } from "../db/index.js";
import { assets } from "../db/schema/asset.js";
import { items } from "../db/schema/item.js";
import { locations } from "../db/schema/location.js";

import type {
  CreateAssetInput,
  UpdateAssetInput,
} from "../validations/asset.validation.js";

export const createAsset = async (input: CreateAssetInput) => {
  // Check item exists
  const [item] = await db
    .select({ id: items.id })
    .from(items)
    .where(eq(items.id, input.itemId))
    .limit(1);

  if (!item) {
    throw new Error("Item not found");
  }

  // Check location exists if provided
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

  // Check asset tag uniqueness
  const [existingAsset] = await db
    .select({ id: assets.id })
    .from(assets)
    .where(eq(assets.assetTag, input.assetTag))
    .limit(1);

  if (existingAsset) {
    throw new Error("Asset tag already exists");
  }

  // Check serial number uniqueness
  if (input.serialNumber) {
    const [existingSerial] = await db
      .select({ id: assets.id })
      .from(assets)
      .where(eq(assets.serialNumber, input.serialNumber))
      .limit(1);

    if (existingSerial) {
      throw new Error("Serial number already exists");
    }
  }

  const [asset] = await db
    .insert(assets)
    .values({
      assetTag: input.assetTag,
      itemId: input.itemId,
      serialNumber: input.serialNumber,
      status: input.status ?? "AVAILABLE",
      locationId: input.locationId,
      purchasePrice:
        input.purchasePrice !== undefined
          ? input.purchasePrice.toFixed(2)
          : undefined,
      notes: input.notes,
    })
    .returning();

  if (!asset) {
    throw new Error("Failed to create asset");
  }

  return asset;
};

export const getAssetById = async (id: string) => {
  const [asset] = await db
    .select()
    .from(assets)
    .where(eq(assets.id, id))
    .limit(1);

  if (!asset) {
    throw new Error("Asset not found");
  }

  return asset;
};

export const getAssets = async () => {
  return db.select().from(assets);
};

export const updateAsset = async (id: string, input: UpdateAssetInput) => {
  const existingAsset = await getAssetById(id);

  if (input.itemId) {
    const [item] = await db
      .select({ id: items.id })
      .from(items)
      .where(eq(items.id, input.itemId))
      .limit(1);

    if (!item) {
      throw new Error("Item not found");
    }
  }

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

  if (input.assetTag && input.assetTag !== existingAsset.assetTag) {
    const [duplicateTag] = await db
      .select({ id: assets.id })
      .from(assets)
      .where(and(eq(assets.assetTag, input.assetTag), ne(assets.id, id)))
      .limit(1);

    if (duplicateTag && duplicateTag.id !== id) {
      throw new Error("Asset tag already exists");
    }
  }

  if (input.serialNumber && input.serialNumber !== existingAsset.serialNumber) {
    const [duplicateSerial] = await db
      .select({ id: assets.id })
      .from(assets)
      .where(
        and(eq(assets.serialNumber, input.serialNumber), ne(assets.id, id)),
      )
      .limit(1);

    if (duplicateSerial && duplicateSerial.id !== id) {
      throw new Error("Serial number already exists");
    }
  }

  const [asset] = await db
    .update(assets)
    .set({
      assetTag: input.assetTag,
      itemId: input.itemId,
      serialNumber: input.serialNumber,
      status: input.status,
      locationId: input.locationId,
      purchasePrice:
        input.purchasePrice !== undefined
          ? input.purchasePrice.toFixed(2)
          : undefined,
      notes: input.notes,
      updatedAt: new Date(),
    })
    .where(eq(assets.id, id))
    .returning();

  if (!asset) {
    throw new Error("Asset not found or update failed");
  }

  return asset;
};

export const deleteAsset = async (id: string) => {
  const existingAsset = await getAssetById(id);

  if (existingAsset.status !== "AVAILABLE") {
    throw new Error("Only available assets can be deleted");
  }

  await db.delete(assets).where(eq(assets.id, id));

  return {
    message: "Asset deleted successfully",
  };
};

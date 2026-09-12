import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { locations } from "../db/schema/location.js";

import type {
  LocationCreateInput,
  LocationUpdateInput,
} from "../validations/location.validation.js";

export const createLocation = async (input: LocationCreateInput) => {
  const existingLocation = await db
    .select({ id: locations.id })
    .from(locations)
    .where(eq(locations.code, input.code))
    .limit(1);

  if (existingLocation.length > 0) {
    throw new Error("Location with this code already exists");
  }

  // Check parent location exists
  if (input.parentLocationId) {
    const [parentLocation] = await db
      .select({ id: locations.id })
      .from(locations)
      .where(eq(locations.id, input.parentLocationId))
      .limit(1);

    if (!parentLocation) {
      throw new Error("Parent location not found");
    }
  }

  const [location] = await db
    .insert(locations)
    .values({
      name: input.name,
      code: input.code,
      type: input.type,
      parentLocationId: input.parentLocationId ?? null,
      description: input.description ?? null,
    })
    .returning();

  if (!location) {
    throw new Error("Failed to create location");
  }

  return location;
};

export const getLocations = async () => {
  return db.select().from(locations).orderBy(locations.name);
};

export const getLocationById = async (id: string) => {
  const [location] = await db
    .select()
    .from(locations)
    .where(eq(locations.id, id))
    .limit(1);

  if (!location) {
    throw new Error("Location not found");
  }

  return location;
};

export const updateLocation = async (
  id: string,
  input: LocationUpdateInput,
) => {
  const [existingLocation] = await db
    .select({ id: locations.id })
    .from(locations)
    .where(eq(locations.id, id))
    .limit(1);

  if (!existingLocation) {
    throw new Error("Location not found");
  }

  // Check duplicate code
  if (input.code) {
    const [duplicateLocation] = await db
      .select({ id: locations.id })
      .from(locations)
      .where(eq(locations.code, input.code))
      .limit(1);

    if (duplicateLocation && duplicateLocation.id !== id) {
      throw new Error("Location with this code already exists");
    }
  }

  // Validate parent location
  if (input.parentLocationId) {
    if (input.parentLocationId === id) {
      throw new Error("Location cannot be its own parent");
    }

    const [parentLocation] = await db
      .select({ id: locations.id })
      .from(locations)
      .where(eq(locations.id, input.parentLocationId))
      .limit(1);

    if (!parentLocation) {
      throw new Error("Parent location not found");
    }
  }

  const [location] = await db
    .update(locations)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(locations.id, id))
    .returning();

  if (!location) {
    throw new Error("Failed to update location");
  }

  return location;
};

export const deleteLocation = async (id: string) => {
  const [existingLocation] = await db
    .select({ id: locations.id })
    .from(locations)
    .where(eq(locations.id, id))
    .limit(1);

  if (!existingLocation) {
    throw new Error("Location not found");
  }

  await db.delete(locations).where(eq(locations.id, id));

  return {
    message: "Location deleted successfully",
  };
};

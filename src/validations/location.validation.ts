import { z } from "zod";

export const locationCreateSchema = z.object({
  name: z
    .string()
    .min(2, "Location name must be at least 2 characters")
    .max(100, "Location name must not exceed 100 characters"),

  code: z
    .string()
    .min(2, "Location code must be at least 2 characters")
    .max(50, "Location code must not exceed 50 characters"),

  type: z.enum([
    "WAREHOUSE",
    "STORAGE_ROOM",
    "RACK",
    "SHELF",
    "CABINET",
    "BIN",
  ]),

  parentLocationId: z
    .uuid("Invalid parent location ID")
    .nullable()
    .optional(),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .nullable()
    .optional(),
});

export const locationUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Location name must be at least 2 characters")
    .max(100, "Location name must not exceed 100 characters")
    .optional(),

  code: z
    .string()
    .min(2, "Location code must be at least 2 characters")
    .max(50, "Location code must not exceed 50 characters")
    .optional(),

  type: z
    .enum([
      "WAREHOUSE",
      "STORAGE_ROOM",
      "RACK",
      "SHELF",
      "CABINET",
      "BIN",
    ])
    .optional(),

  parentLocationId: z
    .uuid("Invalid parent location ID")
    .nullable()
    .optional(),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .nullable()
    .optional(),
});

export const locationIdParamSchema = z.object({
  id: z.uuid("Invalid location ID"),
});

export const locationResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  code: z.string(),
  type: z.enum([
    "WAREHOUSE",
    "STORAGE_ROOM",
    "RACK",
    "SHELF",
    "CABINET",
    "BIN",
  ]),
  parentLocationId: z.uuid().nullable(),
  description: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const locationListResponseSchema = z.object({
  data: z.array(locationResponseSchema),
});

export const locationSingleResponseSchema = z.object({
  data: locationResponseSchema,
});

export const errorResponseSchema = z.object({
  message: z.string(),
});

export type LocationCreateInput = z.infer<
  typeof locationCreateSchema
>;

export type LocationUpdateInput = z.infer<
  typeof locationUpdateSchema
>;

export type LocationIdParam = z.infer<
  typeof locationIdParamSchema
>;
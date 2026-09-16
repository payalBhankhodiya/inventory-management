import { z } from "zod";

export const itemCreateSchema = z.object({
  name: z
    .string()
    .min(2, "Item name must be at least 2 characters")
    .max(150, "Item name must not exceed 150 characters"),

  sku: z
    .string()
    .min(2, "SKU must be at least 2 characters")
    .max(100, "SKU must not exceed 100 characters"),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .nullable()
    .optional(),

  categoryId: z.uuid("Invalid category ID"),

  manufacturer: z
    .string()
    .max(100, "Manufacturer must not exceed 100 characters")
    .nullable()
    .optional(),

  model: z
    .string()
    .max(100, "Model must not exceed 100 characters")
    .nullable()
    .optional(),

  isAsset: z.boolean().default(true),

  isActive: z.boolean().default(true),
});

export const itemUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Item name must be at least 2 characters")
    .max(150, "Item name must not exceed 150 characters")
    .optional(),

  sku: z
    .string()
    .min(2, "SKU must be at least 2 characters")
    .max(100, "SKU must not exceed 100 characters")
    .optional(),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .nullable()
    .optional(),

  categoryId: z
    .uuid("Invalid category ID")
    .optional(),

  manufacturer: z
    .string()
    .max(100, "Manufacturer must not exceed 100 characters")
    .nullable()
    .optional(),

  model: z
    .string()
    .max(100, "Model must not exceed 100 characters")
    .nullable()
    .optional(),

  isAsset: z.boolean().optional(),

  isActive: z.boolean().optional(),
});

export const itemIdParamSchema = z.object({
  id: z.uuid("Invalid item ID"),
});

export const itemResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  sku: z.string(),
  description: z.string().nullable(),
  categoryId: z.uuid(),
  manufacturer: z.string().nullable(),
  model: z.string().nullable(),
  isAsset: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const itemListResponseSchema = z.object({
  data: z.array(itemResponseSchema),
});

export const itemSingleResponseSchema = z.object({
  data: itemResponseSchema,
});

export const errorResponseSchema = z.object({
  message: z.string(),
});

export type ItemCreateInput = z.infer<
  typeof itemCreateSchema
>;

export type ItemUpdateInput = z.infer<
  typeof itemUpdateSchema
>;

export type ItemIdParam = z.infer<
  typeof itemIdParamSchema
>;
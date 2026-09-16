import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must not exceed 100 characters"),

  parentCategoryId: z
    .uuid("Invalid parent category ID")
    .nullable()
    .optional(),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .nullable()
    .optional(),
});

export const categoryUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must not exceed 100 characters")
    .optional(),

  parentCategoryId: z
    .uuid("Invalid parent category ID")
    .nullable()
    .optional(),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .nullable()
    .optional(),
});

export const categoryIdParamSchema = z.object({
  id: z.uuid("Invalid category ID"),
});

export const categoryResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  parentCategoryId: z.uuid().nullable(),
  description: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const categoryListResponseSchema = z.object({
  data: z.array(categoryResponseSchema),
});

export const categorySingleResponseSchema = z.object({
  data: categoryResponseSchema,
});

export const errorResponseSchema = z.object({
  message: z.string(),
});

export type CategoryCreateInput = z.infer<
  typeof categoryCreateSchema
>;

export type CategoryUpdateInput = z.infer<
  typeof categoryUpdateSchema
>;

export type CategoryIdParam = z.infer<
  typeof categoryIdParamSchema
>;
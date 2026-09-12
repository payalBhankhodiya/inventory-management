import { z } from "zod";

export const departmentCreateSchema = z.object({
  name: z
    .string()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name must not exceed 100 characters"),

  code: z
    .string()
    .min(2, "Department code must be at least 2 characters")
    .max(50, "Department code must not exceed 50 characters"),

  description: z
    .string()
    .max(255, "Description must not exceed 255 characters")
    .optional(),
});

export const departmentUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name must not exceed 100 characters")
    .optional(),

  code: z
    .string()
    .min(2, "Department code must be at least 2 characters")
    .max(50, "Department code must not exceed 50 characters")
    .optional(),

  description: z
    .string()
    .max(255, "Description must not exceed 255 characters")
    .nullable()
    .optional(),
});

export const departmentIdParamSchema = z.object({
  id: z.uuid("Invalid department ID"),
});

export const departmentResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const departmentListResponseSchema = z.object({
  data: z.array(departmentResponseSchema),
});

export const departmentSingleResponseSchema = z.object({
  data: departmentResponseSchema,
});

export const errorResponseSchema = z.object({
  message: z.string(),
});

export type DepartmentCreateInput = z.infer<typeof departmentCreateSchema>;

export type DepartmentUpdateInput = z.infer<typeof departmentUpdateSchema>;

export type DepartmentIdParam = z.infer<typeof departmentIdParamSchema>;

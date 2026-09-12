import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(2).max(100),

  email: z.email(),

  password: z.string().min(8).max(100),

  roleId: z.uuid(),

  departmentId: z.uuid().optional(),
});

export const registerUserResponseSchema = z.object({
  message: z.string(),

  data: z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.string(),
    roleId: z.uuid(),
    departmentId: z.uuid().nullable(),
    isActive: z.boolean(),
    createdAt: z.coerce.date(),
  }),
});

export const loginUserSchema = z.object({
  email: z.email(),

  password: z.string().min(1),
});

export const loginUserResponseSchema = z.object({
  message: z.string(),

  data: z.object({
    token: z.string(),

    user: z.object({
      id: z.uuid(),
      name: z.string(),
      email: z.string(),
      roleId: z.uuid(),
      departmentId: z.uuid().nullable(),
    }),
  }),
});

export const errorResponseSchema = z.object({
  message: z.string(),
});

export const validationErrorResponseSchema = z.object({
  message: z.string(),
  errors: z.array(
    z.object({
      field: z.string(),
      message: z.string(),
    }),
  ),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export type LoginUserInput = z.infer<typeof loginUserSchema>;

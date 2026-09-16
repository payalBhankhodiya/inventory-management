import { z } from "zod";

export const createStockSchema = z.object({
  itemId: z.uuid(),
  locationId: z.uuid(),
  quantity: z.number().int().nonnegative().default(0),
  minimumQuantity: z.number().int().nonnegative().default(0),
  maximumQuantity: z.number().int().positive().optional(),
});

export const updateStockSchema = z
  .object({
    locationId: z.uuid().optional(),
    minimumQuantity: z.number().int().nonnegative().optional(),
    maximumQuantity: z.number().int().positive().optional(),
  })
  .refine(
    (data) =>
      data.maximumQuantity === undefined ||
      data.minimumQuantity === undefined ||
      data.maximumQuantity >= data.minimumQuantity,
    {
      message:
        "Maximum quantity must be greater than or equal to minimum quantity",
      path: ["maximumQuantity"],
    },
  );

export const stockIdParamSchema = z.object({
  id: z.uuid(),
});

export const stockResponseSchema = z.object({
  id: z.uuid(),
  itemId: z.uuid(),
  locationId: z.uuid(),
  quantity: z.number(),
  minimumQuantity: z.number(),
  maximumQuantity: z.number().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CreateStockInput = z.infer<typeof createStockSchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;
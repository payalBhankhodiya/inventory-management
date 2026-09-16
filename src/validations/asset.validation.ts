import { z } from "zod";

export const assetStatusSchema = z.enum([
  "AVAILABLE",
  "ASSIGNED",
  "IN_MAINTENANCE",
  "LOST",
  "DAMAGED",
  "DISPOSED",
]);

export const createAssetSchema = z.object({
  assetTag: z.string().min(1).max(100),
  itemId: z.uuid(),
  serialNumber: z.string().max(150).optional(),
  status: assetStatusSchema.optional(),
  locationId: z.uuid().optional(),
  purchasePrice: z.coerce.number().nonnegative().optional(),
  notes: z.string().optional(),
});

export const updateAssetSchema = z.object({
  assetTag: z.string().min(1).max(100).optional(),
  itemId: z.uuid().optional(),
  serialNumber: z.string().max(150).optional(),
  status: assetStatusSchema.optional(),
  locationId: z.uuid().optional(),
  purchasePrice: z.coerce.number().nonnegative().optional(),
  notes: z.string().optional(),
});

export const assetIdParamSchema = z.object({
  id: z.uuid(),
});

export const assetResponseSchema = z.object({
  id: z.uuid(),
  assetTag: z.string(),
  itemId: z.uuid(),
  serialNumber: z.string().nullable(),
  status: assetStatusSchema,
  locationId: z.uuid().nullable(),
  purchasePrice: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;


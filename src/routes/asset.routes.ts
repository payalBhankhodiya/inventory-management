import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import {
  assetIdParamSchema,
  assetResponseSchema,
  createAssetSchema,
  updateAssetSchema,
} from "../validations/asset.validation.js";

import {
  createAsset,
  deleteAsset,
  getAssetById,
  getAssets,
  updateAsset,
} from "../services/asset.service.js";

export const assetRoutes = async (app: FastifyInstance) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // Create Asset
  server.post(
    "/",
    {
      onRequest: [app.requirePermission("assets.create")],
      schema: {
        tags: ["Assets"],
        summary: "Create a new asset",
        security: [{ bearerAuth: [] }],
        body: createAssetSchema,
        response: {
          201: z.object({
            message: z.string(),
            data: assetResponseSchema,
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const asset = await createAsset(request.body);

        return reply.code(201).send({
          message: "Asset created successfully",
          data: asset,
        });
      } catch (error) {
        return reply.code(400).send({
          message:
            error instanceof Error ? error.message : "Failed to create asset",
        });
      }
    },
  );

  // Get All Assets
  server.get(
    "/",
    {
      onRequest: [app.requirePermission("assets.read")],
      schema: {
        tags: ["Assets"],
        summary: "Get all assets",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            message: z.string(),
            data: z.array(assetResponseSchema),
          }),
        },
      },
    },
    async (_request, reply) => {
      const assetList = await getAssets();

      return reply.send({
        message: "Assets retrieved successfully",
        data: assetList,
      });
    },
  );

  // Get Asset By ID
  server.get(
    "/:id",
    {
      onRequest: [app.requirePermission("assets.read")],
      schema: {
        tags: ["Assets"],
        summary: "Get asset by ID",
        security: [{ bearerAuth: [] }],
        params: assetIdParamSchema,
        response: {
          200: z.object({
            message: z.string(),
            data: assetResponseSchema,
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const asset = await getAssetById(request.params.id);

        return reply.send({
          message: "Asset retrieved successfully",
          data: asset,
        });
      } catch (error) {
        return reply.code(404).send({
          message: error instanceof Error ? error.message : "Asset not found",
        });
      }
    },
  );

  // Update Asset
  server.patch(
    "/:id",
    {
      onRequest: [app.requirePermission("assets.update")],
      schema: {
        tags: ["Assets"],
        summary: "Update an asset",
        security: [{ bearerAuth: [] }],
        params: assetIdParamSchema,
        body: updateAssetSchema,
        response: {
          200: z.object({
            message: z.string(),
            data: assetResponseSchema,
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const asset = await updateAsset(request.params.id, request.body);

        return reply.send({
          message: "Asset updated successfully",
          data: asset,
        });
      } catch (error) {
        return reply.code(400).send({
          message:
            error instanceof Error ? error.message : "Failed to update asset",
        });
      }
    },
  );

  // Delete Asset
  server.delete(
    "/:id",
    {
      onRequest: [app.requirePermission("assets.delete")],
      schema: {
        tags: ["Assets"],
        summary: "Delete an asset",
        security: [{ bearerAuth: [] }],
        params: assetIdParamSchema,
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        return reply.send(await deleteAsset(request.params.id));
      } catch (error) {
        return reply.code(400).send({
          message:
            error instanceof Error ? error.message : "Failed to delete asset",
        });
      }
    },
  );
};

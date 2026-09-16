import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import {
  stockIdParamSchema,
  stockResponseSchema,
  createStockSchema,
  updateStockSchema,
} from "../validations/stock.validation.js";

import {
  createStock,
  deleteStock,
  getStockById,
  getStocks,
  updateStock,
} from "../services/stock.service.js";

export const stockRoutes = async (app: FastifyInstance) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // Create Stock
  server.post(
    "/",
    {
      onRequest: [
        app.requirePermission("stock.create"),
      ],
      schema: {
        tags: ["Stock"],
        summary: "Create a stock record",
        security: [{ bearerAuth: [] }],
        body: createStockSchema,
        response: {
          201: z.object({
            message: z.string(),
            data: stockResponseSchema,
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const stockRecord = await createStock(request.body);

        return reply.code(201).send({
          message: "Stock created successfully",
          data: stockRecord,
        });
      } catch (error) {
        return reply.code(400).send({
          message:
            error instanceof Error
              ? error.message
              : "Failed to create stock",
        });
      }
    },
  );

  // Get All Stock
  server.get(
    "/",
    {
      onRequest: [
        app.requirePermission("stock.read"),
      ],
      schema: {
        tags: ["Stock"],
        summary: "Get all stock records",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            message: z.string(),
            data: z.array(stockResponseSchema),
          }),
        },
      },
    },
    async (_request, reply) => {
      const stockList = await getStocks();

      return reply.send({
        message: "Stock records retrieved successfully",
        data: stockList,
      });
    },
  );

  // Get Stock By ID
  server.get(
    "/:id",
    {
      onRequest: [
        app.requirePermission("stock.read"),
      ],
      schema: {
        tags: ["Stock"],
        summary: "Get stock by ID",
        security: [{ bearerAuth: [] }],
        params: stockIdParamSchema,
        response: {
          200: z.object({
            message: z.string(),
            data: stockResponseSchema,
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const stockRecord = await getStockById(request.params.id);

        return reply.send({
          message: "Stock retrieved successfully",
          data: stockRecord,
        });
      } catch (error) {
        return reply.code(404).send({
          message:
            error instanceof Error
              ? error.message
              : "Stock not found",
        });
      }
    },
  );

  // Update Stock
  server.patch(
    "/:id",
    {
      onRequest: [
        app.requirePermission("stock.update"),
      ],
      schema: {
        tags: ["Stock"],
        summary: "Update stock settings",
        security: [{ bearerAuth: [] }],
        params: stockIdParamSchema,
        body: updateStockSchema,
        response: {
          200: z.object({
            message: z.string(),
            data: stockResponseSchema,
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const stockRecord = await updateStock(
          request.params.id,
          request.body,
        );

        return reply.send({
          message: "Stock updated successfully",
          data: stockRecord,
        });
      } catch (error) {
        return reply.code(400).send({
          message:
            error instanceof Error
              ? error.message
              : "Failed to update stock",
        });
      }
    },
  );

  // Delete Stock
  server.delete(
    "/:id",
    {
      onRequest: [
        app.requirePermission("stock.delete"),
      ],
      schema: {
        tags: ["Stock"],
        summary: "Delete a stock record",
        security: [{ bearerAuth: [] }],
        params: stockIdParamSchema,
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
        return reply.send(
          await deleteStock(request.params.id),
        );
      } catch (error) {
        return reply.code(400).send({
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete stock",
        });
      }
    },
  );
};
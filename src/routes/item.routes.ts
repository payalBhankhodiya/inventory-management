import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import {
  createItem,
  deleteItem,
  getItemById,
  getItems,
  updateItem,
} from "../services/item.service.js";

import {
  errorResponseSchema,
  itemCreateSchema,
  itemIdParamSchema,
  itemListResponseSchema,
  itemSingleResponseSchema,
  itemUpdateSchema,
} from "../validations/item.validation.js";

export const itemRoutes = async (app: FastifyInstance) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // Create Item
  server.post(
    "/",
    {
      preHandler: app.requirePermission("items.create"),
      schema: {
        tags: ["Items"],
        security: [{ bearerAuth: [] }],
        body: itemCreateSchema,
        response: {
          201: itemSingleResponseSchema,
          404: errorResponseSchema,
          409: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const item = await createItem(request.body);

        return reply.code(201).send({
          data: item,
        });
      } catch (error) {
        if (!(error instanceof Error)) {
          return reply.code(500).send({
            message: "Failed to create item",
          });
        }

        if (error.message === "Category not found") {
          return reply.code(404).send({
            message: error.message,
          });
        }

        if (error.message === "Item with this SKU already exists") {
          return reply.code(409).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to create item",
        });
      }
    },
  );

  // Get Items
  server.get(
    "/",
    {
      preHandler: app.requirePermission("items.read"),
      schema: {
        tags: ["Items"],
        security: [{ bearerAuth: [] }],
        response: {
          200: itemListResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      try {
        const itemList = await getItems();

        return reply.code(200).send({
          data: itemList,
        });
      } catch (error) {
        reply.log.error(error);

        return reply.code(500).send({
          message: "Failed to fetch items",
        });
      }
    },
  );

  // Get Item By ID
  server.get(
    "/:id",
    {
      preHandler: app.requirePermission("items.read"),
      schema: {
        tags: ["Items"],
        security: [{ bearerAuth: [] }],
        params: itemIdParamSchema,
        response: {
          200: itemSingleResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const item = await getItemById(request.params.id);

        return reply.code(200).send({
          data: item,
        });
      } catch (error) {
        if (error instanceof Error && error.message === "Item not found") {
          return reply.code(404).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to fetch item",
        });
      }
    },
  );

  // Update Item
  server.patch(
    "/:id",
    {
      preHandler: app.requirePermission("items.update"),
      schema: {
        tags: ["Items"],
        security: [{ bearerAuth: [] }],
        params: itemIdParamSchema,
        body: itemUpdateSchema,
        response: {
          200: itemSingleResponseSchema,
          404: errorResponseSchema,
          409: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const item = await updateItem(request.params.id, request.body);

        return reply.code(200).send({
          data: item,
        });
      } catch (error) {
        if (!(error instanceof Error)) {
          return reply.code(500).send({
            message: "Failed to update item",
          });
        }

        if (
          error.message === "Item not found" ||
          error.message === "Category not found"
        ) {
          return reply.code(404).send({
            message: error.message,
          });
        }

        if (error.message === "Item with this SKU already exists") {
          return reply.code(409).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to update item",
        });
      }
    },
  );

  // Delete Item
  server.delete(
    "/:id",
    {
      preHandler: app.requirePermission("items.delete"),
      schema: {
        tags: ["Items"],
        security: [{ bearerAuth: [] }],
        params: itemIdParamSchema,
        response: {
          200: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const result = await deleteItem(request.params.id);

        return reply.code(200).send(result);
      } catch (error) {
        if (error instanceof Error && error.message === "Item not found") {
          return reply.code(404).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to delete item",
        });
      }
    },
  );
};

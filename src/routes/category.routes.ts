import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../services/category.service.js";

import {
  categoryCreateSchema,
  categoryIdParamSchema,
  categoryListResponseSchema,
  categorySingleResponseSchema,
  categoryUpdateSchema,
  errorResponseSchema,
} from "../validations/category.validation.js";

export const categoryRoutes = async (
  app: FastifyInstance,
) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // Create Category
  server.post(
    "/",
    {
      preHandler: app.requirePermission(
        "categories.create",
      ),
      schema: {
        tags: ["Categories"],
        security: [{ bearerAuth: [] }],
        body: categoryCreateSchema,
        response: {
          201: categorySingleResponseSchema,
          404: errorResponseSchema,
          409: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const category = await createCategory(
          request.body,
        );

        return reply.code(201).send({
          data: category,
        });
      } catch (error) {
        if (!(error instanceof Error)) {
          return reply.code(500).send({
            message: "Failed to create category",
          });
        }

        if (
          error.message ===
          "Category with this name already exists"
        ) {
          return reply.code(409).send({
            message: error.message,
          });
        }

        if (
          error.message ===
          "Parent category not found"
        ) {
          return reply.code(404).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to create category",
        });
      }
    },
  );

  // Get Categories
  server.get(
    "/",
    {
      preHandler: app.requirePermission(
        "categories.read",
      ),
      schema: {
        tags: ["Categories"],
        security: [{ bearerAuth: [] }],
        response: {
          200: categoryListResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      try {
        const categoryList = await getCategories();

        return reply.code(200).send({
          data: categoryList,
        });
      } catch (error) {
        reply.log.error(error);

        return reply.code(500).send({
          message: "Failed to fetch categories",
        });
      }
    },
  );

  // Get Category By ID
  server.get(
    "/:id",
    {
      preHandler: app.requirePermission(
        "categories.read",
      ),
      schema: {
        tags: ["Categories"],
        security: [{ bearerAuth: [] }],
        params: categoryIdParamSchema,
        response: {
          200: categorySingleResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const category = await getCategoryById(
          request.params.id,
        );

        return reply.code(200).send({
          data: category,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Category not found"
        ) {
          return reply.code(404).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to fetch category",
        });
      }
    },
  );

  // Update Category
  server.patch(
    "/:id",
    {
      preHandler: app.requirePermission(
        "categories.update",
      ),
      schema: {
        tags: ["Categories"],
        security: [{ bearerAuth: [] }],
        params: categoryIdParamSchema,
        body: categoryUpdateSchema,
        response: {
          200: categorySingleResponseSchema,
          400: errorResponseSchema,
          404: errorResponseSchema,
          409: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const category = await updateCategory(
          request.params.id,
          request.body,
        );

        return reply.code(200).send({
          data: category,
        });
      } catch (error) {
        if (!(error instanceof Error)) {
          return reply.code(500).send({
            message: "Failed to update category",
          });
        }

        if (
          error.message === "Category not found" ||
          error.message ===
            "Parent category not found"
        ) {
          return reply.code(404).send({
            message: error.message,
          });
        }

        if (
          error.message ===
          "Category with this name already exists"
        ) {
          return reply.code(409).send({
            message: error.message,
          });
        }

        if (
          error.message ===
          "Category cannot be its own parent"
        ) {
          return reply.code(400).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to update category",
        });
      }
    },
  );

  // Delete Category
  server.delete(
    "/:id",
    {
      preHandler: app.requirePermission(
        "categories.delete",
      ),
      schema: {
        tags: ["Categories"],
        security: [{ bearerAuth: [] }],
        params: categoryIdParamSchema,
        response: {
          200: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const result = await deleteCategory(
          request.params.id,
        );

        return reply.code(200).send(result);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Category not found"
        ) {
          return reply.code(404).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to delete category",
        });
      }
    },
  );
};
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
} from "../services/department.service.js";

import {
  departmentCreateSchema,
  departmentIdParamSchema,
  departmentListResponseSchema,
  departmentSingleResponseSchema,
  departmentUpdateSchema,
  errorResponseSchema,
} from "../validations/department.validation.js";

export const departmentRoutes = async (
  app: FastifyInstance,
) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // Create Department
  server.post(
    "/",
    {
      schema: {
        tags: ["Departments"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        body: departmentCreateSchema,
        response: {
          201: departmentSingleResponseSchema,
          409: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
      preHandler: app.requirePermission("departments.create"),
    },
    async (request, reply) => {
      try {
        const department = await createDepartment(
          request.body,
        );

        return reply.code(201).send({
          data: department,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message ===
            "Department with this code already exists"
        ) {
          return reply.code(409).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to create department",
        });
      }
    },
  );

  // Get Departments
  server.get(
    "/",
    {
      schema: {
        tags: ["Departments"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        response: {
          200: departmentListResponseSchema,
        },
      },
      preHandler: app.requirePermission("departments.read"),
    },
    async () => {
      const data = await getDepartments();

      return {
        data,
      };
    },
  );

  // Get Department By ID
  server.get(
    "/:id",
    {
      schema: {
        tags: ["Departments"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        params: departmentIdParamSchema,
        response: {
          200: departmentSingleResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
      preHandler: app.requirePermission("departments.read"),
    },
    async (request, reply) => {
      try {
        const department = await getDepartmentById(
          request.params.id,
        );

        return reply.code(200).send({
          data: department,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Department not found"
        ) {
          return reply.code(404).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to get department",
        });
      }
    },
  );

  // Update Department
  server.patch(
    "/:id",
    {
      schema: {
        tags: ["Departments"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        params: departmentIdParamSchema,
        body: departmentUpdateSchema,
        response: {
          200: departmentSingleResponseSchema,
          404: errorResponseSchema,
          409: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
      preHandler: app.requirePermission("departments.update"),
    },
    async (request, reply) => {
      try {
        const department = await updateDepartment(
          request.params.id,
          request.body,
        );

        return reply.code(200).send({
          data: department,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Department not found"
        ) {
          return reply.code(404).send({
            message: error.message,
          });
        }

        if (
          error instanceof Error &&
          error.message ===
            "Department with this code already exists"
        ) {
          return reply.code(409).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to update department",
        });
      }
    },
  );

  // Delete Department
  server.delete(
    "/:id",
    {
      schema: {
        tags: ["Departments"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        params: departmentIdParamSchema,
        response: {
          200: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
      preHandler: app.requirePermission("departments.delete"),
    },
    async (request, reply) => {
      try {
        return reply.code(200).send(
          await deleteDepartment(request.params.id),
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Department not found"
        ) {
          return reply.code(404).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to delete department",
        });
      }
    },
  );
};


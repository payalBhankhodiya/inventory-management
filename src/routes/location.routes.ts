import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import {
  createLocation,
  deleteLocation,
  getLocationById,
  getLocations,
  updateLocation,
} from "../services/location.service.js";

import {
  errorResponseSchema,
  locationCreateSchema,
  locationIdParamSchema,
  locationListResponseSchema,
  locationSingleResponseSchema,
  locationUpdateSchema,
} from "../validations/location.validation.js";

export const locationRoutes = async (app: FastifyInstance) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.post(
    "/",
    {
      preHandler: app.requirePermission("locations.create"),
      schema: {
        tags: ["Locations"],
        security: [{ bearerAuth: [] }],
        body: locationCreateSchema,
        response: {
          201: locationSingleResponseSchema,
          409: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const location = await createLocation(request.body);

        return reply.code(201).send({
          data: location,
        });
      } catch (error) {
        if (!(error instanceof Error)) {
          return reply.code(500).send({
            message: "Failed to create location",
          });
        }

        if (error.message === "Location with this code already exists") {
          return reply.code(409).send({
            message: error.message,
          });
        }

        if (error.message === "Parent location not found") {
          return reply.code(404).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to create location",
        });
      }
    },
  );

  server.get(
    "/",
    {
      preHandler: app.requirePermission("locations.read"),
      schema: {
        tags: ["Locations"],
        security: [{ bearerAuth: [] }],
        response: {
          200: locationListResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      try {
        const locationList = await getLocations();

        return reply.code(200).send({
          data: locationList,
        });
      } catch (error) {
        reply.log.error(error);

        return reply.code(500).send({
          message: "Failed to fetch locations",
        });
      }
    },
  );

  server.get(
    "/:id",
    {
      preHandler: app.requirePermission("locations.read"),
      schema: {
        tags: ["Locations"],
        security: [{ bearerAuth: [] }],
        params: locationIdParamSchema,
        response: {
          200: locationSingleResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const location = await getLocationById(request.params.id);

        return reply.code(200).send({
          data: location,
        });
      } catch (error) {
        if (error instanceof Error && error.message === "Location not found") {
          return reply.code(404).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to fetch location",
        });
      }
    },
  );

  server.patch(
    "/:id",
    {
      preHandler: app.requirePermission("locations.update"),
      schema: {
        tags: ["Locations"],
        security: [{ bearerAuth: [] }],
        params: locationIdParamSchema,
        body: locationUpdateSchema,
        response: {
          200: locationSingleResponseSchema,
          400: errorResponseSchema,
          404: errorResponseSchema,
          409: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const location = await updateLocation(request.params.id, request.body);

        return reply.code(200).send({
          data: location,
        });
      } catch (error) {
        if (!(error instanceof Error)) {
          return reply.code(500).send({
            message: "Failed to update location",
          });
        }

        if (
          error.message === "Location not found" ||
          error.message === "Parent location not found"
        ) {
          return reply.code(404).send({
            message: error.message,
          });
        }

        if (error.message === "Location with this code already exists") {
          return reply.code(409).send({
            message: error.message,
          });
        }

        if (error.message === "Location cannot be its own parent") {
          return reply.code(400).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to update location",
        });
      }
    },
  );

  server.delete(
    "/:id",
    {
      preHandler: app.requirePermission("locations.delete"),
      schema: {
        tags: ["Locations"],
        security: [{ bearerAuth: [] }],
        params: locationIdParamSchema,
        response: {
          200: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const result = await deleteLocation(request.params.id);

        return reply.code(200).send(result);
      } catch (error) {
        if (error instanceof Error && error.message === "Location not found") {
          return reply.code(404).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to delete location",
        });
      }
    },
  );
};

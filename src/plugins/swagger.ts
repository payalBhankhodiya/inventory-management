import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";

import {
  jsonSchemaTransform,
  jsonSchemaTransformObject,
} from "fastify-type-provider-zod";

export const registerSwagger = async (
  app: FastifyInstance,
) => {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Inventory Management API",
        description: "Internal Inventory Management System API",
        version: "1.0.0",
      },

      servers: [
        {
          url: "http://localhost:3000",
        },
      ],

      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },

    transform: jsonSchemaTransform,

    transformObject: jsonSchemaTransformObject,
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });
};


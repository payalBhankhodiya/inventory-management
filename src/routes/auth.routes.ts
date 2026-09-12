import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { loginUser, registerUser } from "../services/auth.service.js";

import {
  errorResponseSchema,
  loginUserResponseSchema,
  loginUserSchema,
  registerUserResponseSchema,
  registerUserSchema,
} from "../validations/auth.validation.js";

export const authRoutes = async (app: FastifyInstance) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // Register
  server.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        body: registerUserSchema,
        response: {
          201: registerUserResponseSchema,
          409: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const user = await registerUser(request.body);

        return reply.code(201).send({
          message: "User registered successfully",
          data: user,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "User with this email already exists"
        ) {
          return reply.code(409).send({
            message: error.message,
          });
        }

        request.log.error(error);

        return reply.code(500).send({
          message: "Failed to register user",
        });
      }
    },
  );

  // Login
  server.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        body: loginUserSchema,
        response: {
          200: loginUserResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const user = await loginUser(request.body.email, request.body.password);

        const token = await reply.jwtSign({
          userId: user.id,
          roleId: user.roleId,
        });

        return reply.code(200).send({
          message: "Login successful",
          data: {
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              roleId: user.roleId,
              departmentId: user.departmentId,
            },
          },
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "User account is inactive"
        ) {
          return reply.code(403).send({
            message: error.message,
          });
        }

        return reply.code(401).send({
          message: "Invalid email or password",
        });
      }
    },
  );
};

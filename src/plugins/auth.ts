import fastifyJwt from "@fastify/jwt";
import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";

export const registerAuth = async (app: FastifyInstance) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  await app.register(fastifyJwt, {
    secret,
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
    },
  });

  app.decorate(
    "authenticate",
    async (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }
    },
  );
};


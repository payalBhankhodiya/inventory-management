import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<unknown>;

    requirePermission: (
      permissionName: string,
    ) => (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<unknown>;
  }
}
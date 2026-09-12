import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { and, eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { permissions } from "../db/schema/permission.js";
import { rolePermissions } from "../db/schema/role-permission.js";

export const registerPermission = async (
  app: FastifyInstance,
) => {
  app.decorate(
    "requirePermission",
    (permissionName: string) => {
      return async (
        request: FastifyRequest,
        reply: FastifyReply,
      ) => {
        try {
          await request.jwtVerify();

          const user = request.user as {
            userId: string;
            roleId: string;
          };

          const [permission] = await db
            .select({
              id: permissions.id,
            })
            .from(permissions)
            .where(eq(permissions.name, permissionName))
            .limit(1);

          if (!permission) {
            return reply.code(403).send({
              message: "Permission does not exist",
            });
          }

          const [rolePermission] = await db
            .select({
              roleId: rolePermissions.roleId,
            })
            .from(rolePermissions)
            .where(
              and(
                eq(
                  rolePermissions.roleId,
                  user.roleId,
                ),
                eq(
                  rolePermissions.permissionId,
                  permission.id,
                ),
              ),
            )
            .limit(1);

          if (!rolePermission) {
            return reply.code(403).send({
              message: "Forbidden",
            });
          }
        } catch {
          return reply.code(401).send({
            message: "Unauthorized",
          });
        }
      };
    },
  );
};
import "dotenv/config";

import Fastify from "fastify";

import { registerAuth } from "./plugins/auth.js";
import { authRoutes } from "./routes/auth.routes.js";
import { registerSwagger } from "./plugins/swagger.js";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { registerPermission } from "./plugins/permission.js";
import { departmentRoutes } from "./routes/department.routes.js";
import { locationRoutes } from "./routes/location.routes.js";

const app = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get("/", async () => {
  return {
    message: "Inventory Management API is running",
  };
});

const start = async () => {
  try {
    await registerSwagger(app);

    await registerAuth(app);

    await registerPermission(app);

    await app.register(authRoutes, {
      prefix: "/api/auth",
    });

    await app.register(departmentRoutes, {
      prefix: "/api/departments",
    });

    await app.register(locationRoutes, {
      prefix: "/api/locations",
    });

    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0",
    });

    console.log(
      `Server running on http://localhost:${Number(process.env.PORT) || 3000}`,
    );
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();

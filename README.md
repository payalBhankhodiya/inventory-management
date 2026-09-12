pnpm init

pnpm add -D typescript tsx @types/node
pnpm exec tsc --init

mkdir src
New-Item -ItemType File -Path src\server.ts
pnpm exec tsc --noEmit

pnpm add fastify

pnpm add drizzle-orm pg

pnpm add -D drizzle-kit @types/pg

mkdir src\db
mkdir src\db\schema

pnpm add dotenv

pnpm exec drizzle-kit check

pnpm add @fastify/jwt bcrypt

pnpm add -D @types/bcrypt

<!-- for generate security key -->

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

mkdir src\plugins

mkdir src\services

mkdir src\routes

pnpm add @fastify/swagger @fastify/swagger-ui

pnpm add zod

pnpm add fastify-type-provider-zod

mkdir src/types
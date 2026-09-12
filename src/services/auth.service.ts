import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { users } from "../db/schema/user.js";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  roleId: string;
  departmentId?: string | undefined;
}

export const registerUser = async (
  input: RegisterUserInput,
) => {
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    input.password,
    12,
  );

  const [user] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      roleId: input.roleId,
      departmentId: input.departmentId,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      roleId: users.roleId,
      departmentId: users.departmentId,
      isActive: users.isActive,
      createdAt: users.createdAt,
    });

  if (!user) {
    throw new Error("Failed to create user");
  }

  return user;
};

export const loginUser = async (
  email: string,
  password: string,
) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
  throw new Error("User account is inactive");
}

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return user;
};
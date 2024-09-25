"use server";

import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

async function getUsers(): Promise<User[]> {
  const users = await prisma.user.findMany({});

  return users;
}

export { getUsers };

"use server";

import { extendArrayOfUsers, SuperUser } from "@/prisma/user-extension";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUsers(): Promise<SuperUser[]> {
  const initialUsers = await prisma.user.findMany({});

  const users = extendArrayOfUsers(initialUsers);

  return users;
}

export { getUsers };

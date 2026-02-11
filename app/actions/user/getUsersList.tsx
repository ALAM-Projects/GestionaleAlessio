"use server";

import { extendArrayOfUsers } from "@/prisma/user-extension";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type GroupUser = {
  id: string;
  fullName: string;
};

async function getUsersList(): Promise<GroupUser[]> {
  const initialUsers = await prisma.user.findMany();

  const users = extendArrayOfUsers(initialUsers);

  // return an array of users with id and fullName
  return users.map((user) => ({
    id: user.id,
    fullName: user.fullName,
  }));
}

export { getUsersList };

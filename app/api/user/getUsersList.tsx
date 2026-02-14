"use server";

import { extendArrayOfUsers } from "@/prisma/user-extension";
import prisma from "@/lib/prisma";

export type GroupUser = {
  id: string;
  fullName: string;
};

async function getUsersList(): Promise<GroupUser[]> {
  const initialUsers = await prisma.user.findMany();
  const users = extendArrayOfUsers(initialUsers);

  return users.map((user) => ({
    id: user.id,
    fullName: user.fullName,
  }));
}

export { getUsersList };

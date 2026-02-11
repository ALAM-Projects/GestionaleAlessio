"use server";

import { extendArrayOfUsers, SuperUser } from "@/prisma/user-extension";
import prisma from "@/lib/prisma";

async function getUsers(): Promise<SuperUser[]> {
  const initialUsers = await prisma.user.findMany({
    include: {
      appointments: true,
    },
  });

  const users = extendArrayOfUsers(initialUsers);

  return users;
}

export { getUsers };

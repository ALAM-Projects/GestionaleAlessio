"use server";

import { PrismaClient, User } from "@prisma/client";
import { extendSuperUser, SuperUser } from "@/prisma/user-extension";

const prisma = new PrismaClient();

async function getUserById(clientId: string): Promise<SuperUser | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: clientId,
    },
    include: {
      appointments: true,
      subscriptions: true,
    },
  });

  if (user) return extendSuperUser(user);
  return null;
}

export { getUserById };

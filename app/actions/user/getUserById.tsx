"use server";

import { PrismaClient, User } from "@prisma/client";
import {
  extendUserWithFullName,
  UserWithFullName,
} from "@/prisma/user-extension";

const prisma = new PrismaClient();

async function getUserById(clientId: string): Promise<UserWithFullName | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: clientId,
    },
    include: {
      appointments: true,
    },
  });

  if (user) return extendUserWithFullName(user);
  return null;
}

export { getUserById };

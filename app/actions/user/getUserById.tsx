"use server";

import { PrismaClient, User } from "@prisma/client";
import { extendUser, SuperUser } from "@/prisma/user-extension";

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

  if (user) {
    user.appointments.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return extendUser(user);
  }
  return null;
}

export { getUserById };

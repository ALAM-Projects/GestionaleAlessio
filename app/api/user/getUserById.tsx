import { PrismaClient, User } from "@prisma/client";
import { extendUser, SuperUser } from "@/prisma/user-extension";
import prisma from "@/lib/prisma";

async function getUserById(clientId: string): Promise<SuperUser | null> {
  let user;
  user = await prisma.user.findUnique({
    where: {
      id: clientId,
    },
    include: {
      appointments: true,
      subscriptions: true,
    },
  });

  if (user) {
    if (user.appointments) {
      user.appointments.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }
    if (user.subscriptions) {
      user.subscriptions.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    return extendUser(user);
  }

  return null;
}

export { getUserById };

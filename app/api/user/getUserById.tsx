"use server";

import type { SuperUser } from "@/prisma/user-extension";
import { extendUser } from "@/prisma/user-extension";
import prisma from "@/lib/prisma";

function toSerializable<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
  );
}

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

  if (!user) {
    return null;
  }

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

  const superUser = extendUser(user);
  return toSerializable(superUser);
}

export { getUserById };

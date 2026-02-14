"use server";

import type { SuperUser } from "@/prisma/user-extension";
import { extendArrayOfUsers } from "@/prisma/user-extension";
import prisma from "@/lib/prisma";

function toSerializable<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
  );
}

async function getUsers(): Promise<SuperUser[]> {
  const initialUsers = await prisma.user.findMany({
    include: {
      appointments: true,
    },
  });

  const users = extendArrayOfUsers(initialUsers);
  return toSerializable(users);
}

export { getUsers };

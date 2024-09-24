"use server";

import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

async function updateUser(
  clientData: ClientDataProps,
  userId: string
): Promise<User> {
  const newUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      id: userId,
      weight: clientData.weight,
      height: clientData.height,
      goal: clientData.goal,
      age: clientData.age,
      injuries: clientData.injuries,
      surgeries: clientData.surgeries,
    },
  });

  return newUser;
}

export { updateUser };

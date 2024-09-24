"use server";

import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

async function createUser(clientData: ClientDataProps): Promise<User> {
  const newUser = await prisma.user.create({
    data: {
      name: clientData.name,
      surname: clientData.surname,
      phone: clientData.phone,
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

export { createUser };

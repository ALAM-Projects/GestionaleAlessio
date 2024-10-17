"use server";

import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

async function updateUser(
  clientData: ClientDataProps,
  userId?: string
): Promise<User> {
  if (!userId) {
    throw new Error("User not found");
  }
  const newUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      id: userId,
      goal: clientData.goal,
      currentlyTraining: clientData.currentlyTraining,
      personalTraining: clientData.personalTraining,
      currentTrainingRate: clientData.currentTrainingRate,
      currentSport: clientData.currentSport,
      inactivityPeriod: clientData.inactivityPeriod,
      inactivityReason: clientData.inactivityReason,
      problems: clientData.problems,
      injuries: clientData.injuries,
      surgeries: clientData.surgeries,
    },
  });

  return newUser;
}

export { updateUser };

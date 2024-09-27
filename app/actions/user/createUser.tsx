"use server";

import { PrismaClient, Prisma, User } from "@prisma/client";

const prisma = new PrismaClient();

async function createUser(clientData: ClientDataProps): Promise<User | any> {
  try {
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
        sex: clientData.sex,
        currentlyTraining: clientData.currentlyTraining,
        currentTrainingRate: clientData.currentTrainingRate,
        currentSport: clientData.currentSport,
        personalTraining: clientData.personalTraining,
        inactivityPeriod: clientData.inactivityPeriod,
        inactivityReason: clientData.inactivityReason,
        problems: clientData.problems,
      },
    });
    return newUser;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        return "I tuoi dati sono già presenti. Una volta completata la scheda di anamnesi non occorre compilarla nuovamente.";
      }
    }
    throw e;
  }
}

export { createUser };

"use server";

import type { User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

async function createUser(
  clientData: ClientDataProps,
): Promise<User | string> {
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
  } catch (e: unknown) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return "I tuoi dati sono già presenti. Una volta completata la scheda di anamnesi non occorre compilarla nuovamente.";
    }

    throw new Error("Errore nella creazione utente");
  }
}

export { createUser };

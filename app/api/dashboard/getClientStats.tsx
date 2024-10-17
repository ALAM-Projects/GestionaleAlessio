"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getClientStats(clientId: string): Promise<DashboardStats> {
  const user = await prisma.user.findUnique({
    where: {
      id: clientId,
    },
    include: {
      appointments: true,
    },
  });

  if (user) {
    const earnings = await user.appointments.reduce((acc, training) => {
      if (training.paid && training.status === "Confermato")
        return acc + training.price;
      return acc;
    }, 0);
    return {
      trainingCount: user.appointments.filter(
        (app) => app.status === "Confermato"
      ).length,
      earnings: earnings + "€",
    };
  }
  return {
    usersCount: 0,
    trainingCount: 0,
    earnings: "N/A",
    workedHours: "N/A",
  };
}

export { getClientStats };

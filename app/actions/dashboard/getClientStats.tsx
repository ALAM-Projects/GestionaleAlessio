"use server";

import { AppointmentStatus } from "@/types/db_types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getClientStats(clientId: string): Promise<DashboardStats> {
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
    const earnings = user.appointments.reduce((acc, training) => {
      if (
        training.paid &&
        training.status === AppointmentStatus.Confermato &&
        !training.paidBySubscription
      )
        return acc + training.price;
      return acc;
    }, 0);

    const subscriptionsEarning = user.subscriptions.reduce((acc, sub) => {
      return acc + sub.totalPaid;
    }, 0);
    return {
      trainingCount: user.appointments.filter(
        (app) => app.status === AppointmentStatus.Confermato
      ).length,
      earnings: earnings + subscriptionsEarning + "€",
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

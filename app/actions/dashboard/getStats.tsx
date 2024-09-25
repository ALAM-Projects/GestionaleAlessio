"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getStats(): Promise<DashboardStats> {
  const users = await prisma.user.findMany();

  const trainings = await prisma.appointment.findMany();

  const earnings = await trainings.reduce((acc, training) => {
    return acc + training.price;
  }, 0);

  if (users && trainings && earnings) {
    return {
      usersCount: users.length,
      trainingCount: trainings.length,
      earnings: earnings + "€",
      workedHours: trainings.length.toString() + "h",
    };
  }
  return {
    usersCount: 0,
    trainingCount: 0,
    earnings: "N/A",
    workedHours: "N/A",
  };
}

export { getStats };

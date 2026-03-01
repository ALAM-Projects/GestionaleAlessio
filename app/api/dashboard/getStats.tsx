"use server";

import prisma from "@/lib/prisma";
import { AppointmentStatus } from "@/types/db_types";

async function getStats(): Promise<DashboardStats> {
  const users = await prisma.user.findMany();

  const trainings = await prisma.appointment.findMany({
    include: {
      user: true,
    },
    where: {
      status: "Confermato",
    },
  });

  const subscriptions = await prisma.subscription.findMany();

  const earnings = trainings.reduce((acc, training) => {
    if (training.paid && !training.paidBySubscription)
      return acc + training.price;
    return acc;
  }, 0);

  const subscriptionsEarning = subscriptions.reduce((acc, sub) => {
    return acc + sub.totalPaid;
  }, 0);

  const unpaid = trainings.reduce((acc, training) => {
    if (!training.paid && training.status === AppointmentStatus.Confermato)
      return acc + training.price;
    return acc;
  }, 0);

  const unpaidFromSubscriptions = subscriptions.reduce((acc, sub) => {
    if (!sub.completed) return acc + (sub.totalPrice - sub.totalPaid);
    return acc;
  }, 0);

  const totalUnpaid = unpaid + unpaidFromSubscriptions;

  if (users.length) {
    return {
      usersCount: users.length,
      unpaid: totalUnpaid + "€",
      earnings: earnings + subscriptionsEarning + "€",
      workedHours: trainings.length.toString() + "h",
    };
  }

  return {
    usersCount: 0,
    unpaid: "N/A",
    earnings: "N/A",
    workedHours: "N/A",
  };
}

export { getStats };

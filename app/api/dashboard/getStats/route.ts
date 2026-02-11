import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
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

  let stats: DashboardStats;

  if (users.length) {
    stats = {
      usersCount: users.length,
      trainingCount: trainings.length,
      earnings: earnings + subscriptionsEarning + "€",
      workedHours: trainings.length.toString() + "h",
    };
  } else {
    stats = {
      usersCount: 0,
      trainingCount: 0,
      earnings: "N/A",
      workedHours: "N/A",
    };
  }

  return NextResponse.json(stats);
}


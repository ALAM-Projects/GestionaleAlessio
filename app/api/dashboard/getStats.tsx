import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  const earnings = await trainings.reduce((acc, training) => {
    if (training.paid && !training.paidBySubscription)
      return acc + training.price;
    return acc;
  }, 0);

  const subscriptionsEarning = subscriptions.reduce((acc, sub) => {
    return acc + sub.totalPaid;
  }, 0);

  if (users) {
    return {
      usersCount: users.length,
      trainingCount: trainings.length,
      earnings: earnings + subscriptionsEarning + "€",
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

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AppointmentStatus } from "@/types/db_types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json(
      { error: "Missing clientId" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: clientId,
    },
    include: {
      appointments: true,
      subscriptions: true,
    },
  });

  if (!user) {
    return NextResponse.json({
      usersCount: 0,
      trainingCount: 0,
      earnings: "N/A",
      workedHours: "N/A",
    } satisfies DashboardStats);
  }

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

  const stats: DashboardStats = {
    trainingCount: user.appointments.filter(
      (app) => app.status === AppointmentStatus.Confermato,
    ).length,
    earnings: earnings + subscriptionsEarning + "€",
  };

  return NextResponse.json(stats);
}


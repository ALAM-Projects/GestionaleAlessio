"use server";

import { Appointment, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getAppointmentsByUserId(
  clientId: string
): Promise<Appointment[] | null> {
  const appointments = await prisma.appointment.findMany({
    where: {
      userId: clientId,
    },
    include: {
      user: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return appointments || null;
}

export { getAppointmentsByUserId };

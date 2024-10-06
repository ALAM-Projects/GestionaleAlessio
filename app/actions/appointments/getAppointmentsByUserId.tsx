"use server";

import { Appointment, PrismaClient, User } from "@prisma/client";

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
  });

  return appointments || null;
}

export { getAppointmentsByUserId };

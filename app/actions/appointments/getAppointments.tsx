"use server";

import { Appointment, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getAppointments(): Promise<Appointment[]> {
  const appointments = await prisma.appointment.findMany({
    include: {
      user: true,
    },
  });

  return appointments;
}

export { getAppointments };

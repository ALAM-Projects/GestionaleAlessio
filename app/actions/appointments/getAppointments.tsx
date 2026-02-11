"use server";

import { Appointment } from "@prisma/client";
import prisma from "@/lib/prisma";

async function getAppointments(): Promise<Appointment[]> {
  const appointments = await prisma.appointment.findMany({
    include: {
      user: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  return appointments;
}

export { getAppointments };

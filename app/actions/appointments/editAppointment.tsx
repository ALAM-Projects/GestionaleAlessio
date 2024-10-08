"use server";

import { Appointment, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function editAppointment(
  appointmentId: string,
  date?: string,
  status?: string,
  paid?: boolean,
  price?: number,
  time?: string
): Promise<Appointment> {
  const updatedAppointment = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      date,
      status,
      price,
      paid,
      time,
    },
  });

  return updatedAppointment;
}

export { editAppointment };

"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function upsertAppointment(
  clientId: string,
  date: string,
  time: string,
  price: number,
  location: string,
  appointmentId?: string
): Promise<boolean> {
  if (appointmentId) {
    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        date,
        time,
        price,
        location,
      },
    });

    return !!updated;
  }
  const created = await prisma.appointment.create({
    data: {
      date,
      time,
      price,
      userId: clientId,
      status: "Confermato",
      paid: false,
      location,
    },
  });

  return !!created;
}

export { upsertAppointment };

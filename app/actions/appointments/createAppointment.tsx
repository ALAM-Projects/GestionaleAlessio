"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAppointment(
  clientId: string,
  date: string,
  time: string,
  price: number
): Promise<boolean> {
  const created = await prisma.appointment.create({
    data: {
      date,
      time,
      price,
      userId: clientId,
      status: "Confermato",
      paid: false,
    },
  });

  return !!created;
}

export { createAppointment };

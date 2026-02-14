"use server";

import type { Appointment } from "@prisma/client";
import prisma from "@/lib/prisma";

function toSerializable<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
  );
}

async function getAppointments(): Promise<Appointment[]> {
  const appointments = await prisma.appointment.findMany({
    include: {
      user: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  return toSerializable(appointments);
}

export { getAppointments };

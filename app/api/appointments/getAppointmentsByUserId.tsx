import type { Appointment } from "@prisma/client";
import prisma from "@/lib/prisma";

async function getAppointmentsByUserId(
  clientId: string,
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

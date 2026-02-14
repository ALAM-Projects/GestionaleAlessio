"use server";

import prisma from "@/lib/prisma";

async function deleteAppointment(appointmentId: string): Promise<boolean> {
  if (!appointmentId) {
    return false;
  }

  await prisma.appointment.delete({
    where: {
      id: appointmentId,
    },
  });

  return true;
}

export { deleteAppointment };

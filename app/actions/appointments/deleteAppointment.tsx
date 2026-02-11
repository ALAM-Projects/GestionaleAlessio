"use server";

import prisma from "@/lib/prisma";

async function deleteAppointment(appointmentId: string): Promise<boolean> {
  const deleted = await prisma.appointment.delete({
    where: {
      id: appointmentId,
    },
  });

  console.log("DELETED", deleted);

  return true;
}

export { deleteAppointment };

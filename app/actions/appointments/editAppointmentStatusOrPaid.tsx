"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function editAppointmentStatusOrPaid(
  appointmentId: string,
  status?: string,
  paid?: boolean
): Promise<boolean> {
  try {
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status,
        paid,
      },
    });

    return !!updatedAppointment;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export { editAppointmentStatusOrPaid };

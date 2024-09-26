"use server";

import { Appointment, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAppointment(
  appointmentData: Appointment
): Promise<Appointment> {
  const newAppointment = await prisma.appointment.create({
    data: appointmentData,
  });

  return newAppointment;
}

export { createAppointment };

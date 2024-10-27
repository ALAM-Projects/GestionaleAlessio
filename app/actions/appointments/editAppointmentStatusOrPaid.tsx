"use server";

import { extendUser } from "@/prisma/user-extension";
import { PrismaClient } from "@prisma/client";
import { AppointmentStatus } from "@/types/db_types";
import { upsertSubscription } from "../subscriptions/upsertSubscription";

const prisma = new PrismaClient();

interface EditAppointmentStatusOrPaid {
  response?: boolean;
  error?: string;
}

async function editAppointmentStatusOrPaid(
  appointmentId: string,
  status?: AppointmentStatus,
  paid?: boolean
): Promise<EditAppointmentStatusOrPaid> {
  try {
    let user;
    let activeSubscription;
    let appointment;
    let updatedSubscription;
    // TROVO L'APPUNTAMENTO E LO AGGIORNO
    appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        user: {
          include: {
            subscriptions: true,
          },
        },
      },
    });

    // SE L'APPUNTAMENTO ESISTE, MI PRENDO I DATI DELL'UTENTE
    if (appointment) {
      user = extendUser(appointment.user);

      // SE L'UTENTE HA UN ABBONAMENTO ATTIVO
      if (user.hasActiveSubscription) {
        activeSubscription = user.subscriptions.find(
          (sub) => sub.completed === false || sub.totalPaid < sub.totalPrice
        );
        if (activeSubscription) {
          // SE STO ANNULLANDO L'APPUNTAMENTO E L'APPUNTAMENTO ERA STATO PAGATO CON L'ABBONAMENTO
          if (
            status === AppointmentStatus.Annullato &&
            activeSubscription.doneAppointments > 0 &&
            appointment.paidBySubscription
          ) {
            const completed = activeSubscription.completed
              ? false
              : activeSubscription.completed;

            updatedSubscription = await upsertSubscription(
              activeSubscription.totalPrice,
              activeSubscription.totalPaid,
              activeSubscription.appointmentsIncluded,
              completed,
              user.id,
              activeSubscription.doneAppointments - 1,
              activeSubscription.id
            );

            if (updatedSubscription) {
              appointment.paidBySubscription = false;
            }
          }
          if (status === AppointmentStatus.Confermato) {
            const completed =
              activeSubscription.doneAppointments + 1 ===
              activeSubscription.appointmentsIncluded;

            updatedSubscription = await upsertSubscription(
              activeSubscription.totalPrice,
              activeSubscription.totalPaid,
              activeSubscription.appointmentsIncluded,
              completed,
              user.id,
              activeSubscription.doneAppointments + 1,
              activeSubscription.id
            );

            if (updatedSubscription) {
              appointment.paidBySubscription = true;
              paid = true;
            }
          }
        }
      }

      const updatedAppointment = await prisma.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          status,
          paid,
          paidBySubscription: appointment.paidBySubscription,
        },
        include: {
          user: true,
        },
      });

      return { response: !!updatedAppointment };
    }
    return { response: false, error: "Appointment not found" };
  } catch (error) {
    return { response: false };
  }
}

export { editAppointmentStatusOrPaid };

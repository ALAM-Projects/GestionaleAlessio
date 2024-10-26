"use server";

import { extendUser } from "@/prisma/user-extension";
import { PrismaClient } from "@prisma/client";
import { AppointmentStatus } from "@/types/db_types";

const prisma = new PrismaClient();

interface EditAppointmentStatusOrPaid {
  response?: boolean;
  error?: string;
}

async function editAppointmentStatusOrPaid(
  appointmentId: string,
  status?: string,
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

      // SE L'UTENTE HA UN ABBONAMENTO ATTIVO E STO ANNULLANDO L'ABBONAMENTO GLI RENDO INDIETRO UN ALLENAMENTO
      // console.log("SUBSCRIPT", user?.hasActiveSubscription);

      if (
        user?.hasActiveSubscription &&
        status === AppointmentStatus.Annullato
      ) {
        // trovo l'abbonamento attivo
        activeSubscription = user.subscriptions.find(
          (sub) => sub.completed === false
        );
        if (activeSubscription) {
          updatedSubscription = await prisma.subscription.update({
            where: {
              id: activeSubscription.id,
            },
            data: {
              doneAppointments: {
                decrement: 1,
              },
              // se l'abbonamento era stato completato, lo riporto a false
              completed: activeSubscription.completed
                ? false
                : activeSubscription.completed,
            },
          });

          if (updatedSubscription) {
            appointment.paidBySubscription = false;
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

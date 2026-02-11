import { extendUser } from "@/prisma/user-extension";
import { AppointmentStatus } from "@/types/db_types";
import { upsertSubscription } from "../subscriptions/upsertSubscription";
import prisma from "@/lib/prisma";

interface EditAppointmentStatusOrPaid {
  response?: boolean;
  error?: string;
}

async function editAppointmentStatusOrPaid(
  appointmentId: string,
  status?: AppointmentStatus,
  paid?: boolean,
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
          (sub) => sub.completed === false || sub.totalPaid < sub.totalPrice,
        );
        if (activeSubscription) {
          // SE STO ANNULLANDO L'APPUNTAMENTO E L'APPUNTAMENTO ERA STATO PAGATO CON L'ABBONAMENTO
          if (
            status === AppointmentStatus.Annullato &&
            activeSubscription.doneAppointments > 0 &&
            appointment.paidBySubscription
          ) {
            updatedSubscription = await upsertSubscription(
              activeSubscription.totalPrice,
              activeSubscription.totalPaid,
              activeSubscription.appointmentsIncluded,
              activeSubscription.completed,
              user.id,
              activeSubscription.doneAppointments - 1,
              activeSubscription.id,
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
              activeSubscription.id,
            );

            if (updatedSubscription) {
              appointment.paidBySubscription = true;
              appointment.price = Number(
                activeSubscription.totalPrice /
                  activeSubscription.appointmentsIncluded,
              );
              paid = true;
            }
          }
        }
        // se sto annullanbdo l'ultimo appuntamewnto incluso nella sub con sub già completata
      }
      if (appointment.paidBySubscription && !activeSubscription) {
        // prendo l'ultima sub completata
        const lastCompletedSubscription =
          user.subscriptions[user.subscriptions.length - 1];

        // tolgo l'ultimo appuntamento fatto e la riattivo
        updatedSubscription = await upsertSubscription(
          lastCompletedSubscription.totalPrice,
          lastCompletedSubscription.totalPaid,
          lastCompletedSubscription.appointmentsIncluded,
          false,
          user.id,
          lastCompletedSubscription.doneAppointments - 1,
          lastCompletedSubscription.id,
        );

        if (updatedSubscription) {
          appointment.paidBySubscription = false;
        }
      }

      const updatedAppointment = await prisma.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          status,
          paid,
          price: appointment.price,
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

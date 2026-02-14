"use server";

import { AppointmentStatus } from "@/types/db_types";
import prisma from "@/lib/prisma";
import { extendUser } from "@/prisma/user-extension";
import { upsertSubscription } from "@/app/api/subscriptions/upsertSubscription";

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
    let paidValue = paid;
    let user;
    let activeSubscription;
    let appointment;
    let updatedSubscription;

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

    if (appointment) {
      user = extendUser(appointment.user);

      if (user.hasActiveSubscription) {
        activeSubscription = user.subscriptions.find(
          (sub) => sub.completed === false || sub.totalPaid < sub.totalPrice,
        );
        if (activeSubscription) {
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
              paidValue = true;
            }
          }
        }
      }
      if (appointment.paidBySubscription && !activeSubscription) {
        const lastCompletedSubscription =
          user.subscriptions[user.subscriptions.length - 1];

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
          paid: paidValue,
          price: appointment.price,
          paidBySubscription: appointment.paidBySubscription,
        },
        include: {
          user: true,
        },
      });

      return {
        response: !!updatedAppointment,
      };
    }

    return {
      response: false,
      error: "Appointment not found",
    };
  } catch {
    return { response: false };
  }
}

export { editAppointmentStatusOrPaid };

"use server";

import { extendUser } from "@/prisma/user-extension";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function upsertAppointment(
  clientId: string,
  date: string,
  time: string,
  price: number,
  location: string,
  appointmentId?: string
): Promise<boolean> {
  // recupera l'utente
  const user = await prisma.user.findUnique({
    where: { id: clientId },
    include: { subscriptions: true },
  });
  let superUser;
  if (user) superUser = extendUser(user);

  if (appointmentId) {
    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        date,
        time,
        price,
        location,
      },
    });

    return !!updated;
  }

  let newAppointmentIsPaid = false;
  let paidBySubscription = false;

  if (superUser?.hasActiveSubscription) {
    const subscription = superUser.subscriptions[0];
    const hasLeftAppointments =
      subscription.appointmentsIncluded - subscription.doneAppointments > 0;
    if (hasLeftAppointments) {
      // aggiorna l'abbonamento decrementando il numero di appuntamenti rimanenti
      const updated = await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          doneAppointments: subscription.doneAppointments + 1,
          completed:
            subscription.doneAppointments + 1 ===
            subscription.appointmentsIncluded,
        },
      });
      if (!updated) {
        throw new Error("Errore nell'aggiornamento dell'abbonamento");
      }

      newAppointmentIsPaid = true;
      paidBySubscription = true;
    }
  }

  const created = await prisma.appointment.create({
    data: {
      date,
      time,
      price,
      userId: clientId,
      status: "Confermato",
      paid: newAppointmentIsPaid,
      paidBySubscription,
      location,
    },
  });

  return !!created;
}

export { upsertAppointment };

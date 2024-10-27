"use server";

import { extendUser } from "@/prisma/user-extension";
import { PrismaClient } from "@prisma/client";
import { upsertSubscription } from "../subscriptions/upsertSubscription";

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

  // SE E' UN UPDATE
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
    const activeSubscription = superUser.subscriptions.find(
      (sub) => !sub.completed || sub.totalPaid < sub.totalPrice
    );
    if (activeSubscription) {
      const hasLeftAppointments =
        activeSubscription.appointmentsIncluded -
          activeSubscription.doneAppointments >
        0;
      if (hasLeftAppointments) {
        const completed =
          activeSubscription.doneAppointments + 1 ===
          activeSubscription.appointmentsIncluded;
        // aggiorna l'abbonamento incrementando il numero di appuntamenti fatti
        const updatedSub = await upsertSubscription(
          activeSubscription.totalPrice,
          activeSubscription.totalPaid,
          activeSubscription.appointmentsIncluded,
          completed,
          clientId,
          activeSubscription.doneAppointments + 1,
          activeSubscription.id
        );

        if (!updatedSub) {
          throw new Error("Errore nell'aggiornamento dell'abbonamento");
        }

        newAppointmentIsPaid = true;
        paidBySubscription = true;
        price = Number(
          activeSubscription.totalPrice /
            activeSubscription.appointmentsIncluded
        );
      }
    }
  }

  console.log("PRICE", price);

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

"use server";

import prisma from "@/lib/prisma";
import { extendUser } from "@/prisma/user-extension";
import { upsertSubscription } from "@/app/api/subscriptions/upsertSubscription";

async function upsertAppointment(
  clientId: string,
  date: string,
  time: string,
  price: number,
  appointmentId?: string,
): Promise<boolean> {
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
        location: "Studio",
      },
    });

    return !!updated;
  }

  let newAppointmentIsPaid = false;
  let paidBySubscription = false;
  let finalPrice = price;
  let subscriptionId: number | undefined;

  if (superUser?.hasActiveSubscription) {
    const activeSubscription = superUser.subscriptions.find(
      (sub) => !sub.completed || sub.totalPaid < sub.totalPrice,
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
        const updatedSub = await upsertSubscription(
          activeSubscription.totalPrice,
          activeSubscription.totalPaid,
          activeSubscription.appointmentsIncluded,
          completed,
          clientId,
          activeSubscription.doneAppointments + 1,
          activeSubscription.id,
        );

        if (!updatedSub) {
          return false;
        }

        newAppointmentIsPaid = true;
        paidBySubscription = true;
        finalPrice = Number(
          activeSubscription.totalPrice /
            activeSubscription.appointmentsIncluded,
        );
        subscriptionId = activeSubscription.id;
      }
    }
  }

  const created = await prisma.appointment.create({
    data: {
      date,
      time,
      price: finalPrice,
      userId: clientId,
      status: "Confermato",
      paid: newAppointmentIsPaid,
      paidBySubscription,
      location: "Studio",
      subscriptionId,
    },
  });

  return !!created;
}

export { upsertAppointment };

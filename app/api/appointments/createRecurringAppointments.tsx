"use server";

import prisma from "@/lib/prisma";
import { extendUser } from "@/prisma/user-extension";

export async function createRecurringAppointments(
  clientId: string,
  dates: string[],
  time: string,
  price: number,
): Promise<{ created: number; total: number }> {
  const user = await prisma.user.findUnique({
    where: { id: clientId },
    include: { subscriptions: true },
  });

  if (!user) return { created: 0, total: dates.length };

  const superUser = extendUser(user);
  const activeSubscription = superUser.subscriptions.find(
    (sub) => !sub.completed || sub.totalPaid < sub.totalPrice,
  );

  let subCovered = 0;
  let pricePerAppointment = price;
  let subscriptionId: number | undefined;

  if (activeSubscription) {
    const remaining =
      activeSubscription.appointmentsIncluded - activeSubscription.doneAppointments;
    subCovered = Math.min(dates.length, remaining);
    pricePerAppointment = Math.round(
      activeSubscription.totalPrice / activeSubscription.appointmentsIncluded,
    );
    subscriptionId = activeSubscription.id;
  }

  const appointmentsData = dates.map((date, i) => ({
    date,
    time,
    price: i < subCovered ? pricePerAppointment : price,
    userId: clientId,
    status: "Confermato",
    paid: i < subCovered,
    paidBySubscription: i < subCovered,
    location: "Studio",
    subscriptionId: i < subCovered ? subscriptionId : undefined,
  }));

  await prisma.$transaction(async (tx) => {
    await tx.appointment.createMany({ data: appointmentsData });

    if (activeSubscription && subCovered > 0) {
      const newDone = activeSubscription.doneAppointments + subCovered;
      await tx.subscription.update({
        where: { id: activeSubscription.id },
        data: {
          doneAppointments: newDone,
          completed: newDone >= activeSubscription.appointmentsIncluded,
        },
      });
    }
  });

  return { created: dates.length, total: dates.length };
}

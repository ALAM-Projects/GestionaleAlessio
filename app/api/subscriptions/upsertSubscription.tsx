"use server";

import prisma from "@/lib/prisma";

async function upsertSubscription(
  totalPrice: number,
  totalPaid: number,
  appointmentsIncluded: number,
  completed: boolean,
  clientId: string,
  doneAppointments?: number,
  subscriptionId?: number,
): Promise<boolean> {
  if (subscriptionId) {
    const pricePerAppointment = Math.round(totalPrice / appointmentsIncluded);

    const [updated] = await prisma.$transaction([
      prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          totalPrice,
          totalPaid,
          appointmentsIncluded,
          doneAppointments,
          completed,
        },
      }),
      prisma.appointment.updateMany({
        where: { subscriptionId },
        data: { price: pricePerAppointment },
      }),
    ]);

    return !!updated;
  }

  if (!subscriptionId && clientId) {
    const existingActive = await prisma.subscription.findFirst({
      where: { userId: clientId, completed: false },
    });

    if (existingActive) return false;

    const created = await prisma.subscription.create({
      data: {
        totalPrice,
        totalPaid,
        appointmentsIncluded,
        completed: false,
        doneAppointments: 0,
        userId: clientId,
      },
    });

    return !!created;
  }

  return false;
}

export { upsertSubscription };

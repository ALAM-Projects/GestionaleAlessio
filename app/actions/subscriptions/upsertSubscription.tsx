"use server";

import prisma from "@/lib/prisma";

async function upsertSubscription(
  totalPrice: number,
  totalPaid: number,
  appointmentsIncluded: number,
  completed: boolean,
  clientId: string,
  doneAppointments?: number,
  subscriptionId?: string
): Promise<boolean> {
  if (subscriptionId) {
    const updated = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        totalPrice,
        totalPaid,
        appointmentsIncluded,
        doneAppointments,
        completed,
      },
    });

    return !!updated;
  }
  if (!subscriptionId && clientId) {
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

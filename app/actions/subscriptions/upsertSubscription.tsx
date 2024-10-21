"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function upsertSubscription(
  clientId: string,
  totalPrice: number,
  totalPaid: number,
  appointmentsIncluded: number,
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
        completed: doneAppointments === appointmentsIncluded,
      },
    });

    return !!updated;
  }
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

export { upsertSubscription };

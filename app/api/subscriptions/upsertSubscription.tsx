"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

async function upsertSubscription(
  totalPrice: number,
  totalPaid: number,
  appointmentsIncluded: number,
  completed: boolean,
  clientId: string,
  doneAppointments?: number,
  subscriptionId?: number,
  advancePaymentDate?: string | null,
  expirationDate?: string | null,
  paymentType?: string,
  installments?: any,
): Promise<boolean> {
  if (subscriptionId) {
    const pricePerAppointment = Math.round(totalPrice / appointmentsIncluded);

    const updateData: Prisma.SubscriptionUpdateInput = {
      totalPrice,
      totalPaid,
      appointmentsIncluded,
      doneAppointments,
      completed,
    };

    if (advancePaymentDate !== undefined) {
      updateData.advancePaymentDate = advancePaymentDate;
    }
    if (expirationDate !== undefined) {
      updateData.expirationDate = expirationDate;
    }
    if (paymentType !== undefined) {
      updateData.paymentType = paymentType;
    }
    if (installments !== undefined) {
      updateData.installments =
        installments === null ? Prisma.JsonNull : (installments as Prisma.InputJsonValue);
    }

    const [updated] = await prisma.$transaction([
      prisma.subscription.update({
        where: { id: subscriptionId },
        data: updateData,
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
        advancePaymentDate: advancePaymentDate || null,
        expirationDate: expirationDate || null,
        paymentType: paymentType || "FULL",
        installments:
          installments ? (installments as Prisma.InputJsonValue) : Prisma.JsonNull,
        userId: clientId,
      },
    });

    return !!created;
  }

  return false;
}

export { upsertSubscription };

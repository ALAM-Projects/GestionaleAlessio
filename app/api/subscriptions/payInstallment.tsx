"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  getTodayDateString,
  parseInstallments,
  SubscriptionInstallment,
} from "@/lib/subscription-helpers";

async function payInstallment(
  subscriptionId: number,
  installmentNumber: number,
  paidDate?: string,
): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });

  if (!subscription) return false;

  const installments = parseInstallments(subscription.installments);
  if (installments.length === 0) return false;

  const effectiveDate = paidDate || getTodayDateString();

  let installmentFound = false;
  const updatedInstallments: SubscriptionInstallment[] = installments.map(
    (inst) => {
      if (inst.installmentNumber === installmentNumber) {
        installmentFound = true;
        return {
          ...inst,
          paid: true,
          paidDate: effectiveDate,
        };
      }
      return inst;
    },
  );

  if (!installmentFound) return false;

  const newTotalPaid = updatedInstallments.reduce((sum, inst) => {
    return inst.paid ? sum + inst.amount : sum;
  }, 0);

  const updated = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      totalPaid: newTotalPaid,
      installments: updatedInstallments as unknown as Prisma.InputJsonValue,
    },
  });

  return !!updated;
}

export { payInstallment };

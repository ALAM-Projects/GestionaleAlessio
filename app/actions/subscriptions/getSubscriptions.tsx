"use server";

import { Subscription } from "@prisma/client";
import prisma from "@/lib/prisma";

async function getSubscriptions(): Promise<Subscription[]> {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return subscriptions;
}

export { getSubscriptions };

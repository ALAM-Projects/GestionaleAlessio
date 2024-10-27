"use server";

import { PrismaClient, Subscription } from "@prisma/client";

const prisma = new PrismaClient();

async function getSubscriptions(): Promise<Subscription[]> {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return subscriptions;
}

export { getSubscriptions };

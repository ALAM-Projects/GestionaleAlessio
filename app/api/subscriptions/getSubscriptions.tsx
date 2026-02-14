"use server";

import type { Subscription } from "@prisma/client";
import prisma from "@/lib/prisma";

function toSerializable<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
  );
}

async function getSubscriptions(): Promise<Subscription[]> {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return toSerializable(subscriptions);
}

export { getSubscriptions };

import { Subscription } from "@prisma/client";

async function getSubscriptions(): Promise<Subscription[]> {
  const res = await fetch("/api/subscriptions/getSubscriptions", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch subscriptions");
  }

  return res.json();
}

export { getSubscriptions };

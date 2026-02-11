async function upsertSubscription(
  totalPrice: number,
  totalPaid: number,
  appointmentsIncluded: number,
  completed: boolean,
  clientId: string,
  doneAppointments?: number,
  subscriptionId?: string,
): Promise<boolean> {
  const res = await fetch("/api/subscriptions/upsertSubscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      totalPrice,
      totalPaid,
      appointmentsIncluded,
      completed,
      clientId,
      doneAppointments,
      subscriptionId,
    }),
  });

  if (!res.ok) {
    return false;
  }

  const data = await res.json();
  return !!data?.success;
}

export { upsertSubscription };

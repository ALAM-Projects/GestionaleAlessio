async function upsertAppointment(
  clientId: string,
  date: string,
  time: string,
  price: number,
  location: string,
  appointmentId?: string,
): Promise<boolean> {
  const res = await fetch("/api/appointments/upsert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientId,
      date,
      time,
      price,
      location,
      appointmentId,
    }),
  });

  if (!res.ok) {
    return false;
  }

  const data = await res.json();
  return !!data?.success;
}

export { upsertAppointment };

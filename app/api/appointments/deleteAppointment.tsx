async function deleteAppointment(appointmentId: string): Promise<boolean> {
  const res = await fetch("/api/appointments/deleteAppointment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ appointmentId }),
  });

  if (!res.ok) {
    return false;
  }

  const data = await res.json();
  return !!data?.success;
}

export { deleteAppointment };

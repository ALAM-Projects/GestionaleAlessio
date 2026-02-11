import { Appointment } from "@prisma/client";

async function getAppointments(): Promise<Appointment[]> {
  const res = await fetch("/api/appointments/getAppointments", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return res.json();
}

export { getAppointments };

import { AppointmentStatus } from "@/types/db_types";

interface EditAppointmentStatusOrPaid {
  response?: boolean;
  error?: string;
}

async function editAppointmentStatusOrPaid(
  appointmentId: string,
  status?: AppointmentStatus,
  paid?: boolean,
): Promise<EditAppointmentStatusOrPaid> {
  const res = await fetch("/api/appointments/editAppointmentStatusOrPaid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      appointmentId,
      status,
      paid,
    }),
  });

  if (!res.ok) {
    return { response: false };
  }

  return res.json();
}

export { editAppointmentStatusOrPaid };

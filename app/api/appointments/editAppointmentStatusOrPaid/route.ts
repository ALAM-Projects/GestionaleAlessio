import { NextResponse } from "next/server";
import { AppointmentStatus } from "@/types/db_types";
import { editAppointmentStatusOrPaid } from "@/app/api/appointments/editAppointmentStatusOrPaid";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    appointmentId,
    status,
    paid,
  }: {
    appointmentId: string;
    status?: AppointmentStatus;
    paid?: boolean;
  } = body;

  const result = await editAppointmentStatusOrPaid(appointmentId, status, paid);

  if (result.error === "Appointment not found") {
    return NextResponse.json(result, { status: 404 });
  }

  if (!result.response) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}


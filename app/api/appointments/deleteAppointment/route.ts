import { NextResponse } from "next/server";
import { deleteAppointment } from "@/app/api/appointments/deleteAppointment";

export async function POST(request: Request) {
  const body = await request.json();
  const { appointmentId }: { appointmentId: string } = body;

  if (!appointmentId) {
    return NextResponse.json(
      { success: false, error: "Missing appointmentId" },
      { status: 400 },
    );
  }

  const success = await deleteAppointment(appointmentId);

  return NextResponse.json({ success });
}


import { NextResponse } from "next/server";
import { getAppointments } from "@/app/api/appointments/getAppointments";

export const dynamic = "force-dynamic";

export async function GET() {
  const appointments = await getAppointments();
  return NextResponse.json(appointments);
}


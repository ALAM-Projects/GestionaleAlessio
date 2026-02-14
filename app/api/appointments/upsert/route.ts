import { NextResponse } from "next/server";
import { upsertAppointment } from "@/app/api/appointments/upsertAppointment";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    clientId,
    date,
    time,
    price,
    location,
    appointmentId,
  }: {
    clientId: string;
    date: string;
    time: string;
    price: number;
    location: string;
    appointmentId?: string;
  } = body;

  const success = await upsertAppointment(
    clientId,
    date,
    time,
    price,
    location,
    appointmentId,
  );

  return NextResponse.json({ success });
}


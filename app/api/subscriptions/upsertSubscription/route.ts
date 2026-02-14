import { NextResponse } from "next/server";
import { upsertSubscription } from "@/app/api/subscriptions/upsertSubscription";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    totalPrice,
    totalPaid,
    appointmentsIncluded,
    completed,
    clientId,
    doneAppointments,
    subscriptionId,
  }: {
    totalPrice: number;
    totalPaid: number;
    appointmentsIncluded: number;
    completed: boolean;
    clientId: string;
    doneAppointments?: number;
    subscriptionId?: string;
  } = body;

  const success = await upsertSubscription(
    totalPrice,
    totalPaid,
    appointmentsIncluded,
    completed,
    clientId,
    doneAppointments,
    subscriptionId != null ? Number(subscriptionId) : undefined,
  );

  if (!success) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

  if (subscriptionId) {
    const updated = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        totalPrice,
        totalPaid,
        appointmentsIncluded,
        doneAppointments,
        completed,
      },
    });

    return NextResponse.json({ success: !!updated });
  }

  if (!subscriptionId && clientId) {
    const created = await prisma.subscription.create({
      data: {
        totalPrice,
        totalPaid,
        appointmentsIncluded,
        completed: false,
        doneAppointments: 0,
        userId: clientId,
      },
    });

    return NextResponse.json({ success: !!created });
  }

  return NextResponse.json({ success: false }, { status: 400 });
}


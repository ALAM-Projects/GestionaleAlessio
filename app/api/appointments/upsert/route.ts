import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extendUser } from "@/prisma/user-extension";
import { upsertSubscription } from "@/app/api/subscriptions/upsertSubscription";

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

  const user = await prisma.user.findUnique({
    where: { id: clientId },
    include: { subscriptions: true },
  });

  let superUser;
  if (user) superUser = extendUser(user);

  if (appointmentId) {
    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        date,
        time,
        price,
        location,
      },
    });

    return NextResponse.json({ success: !!updated });
  }

  let newAppointmentIsPaid = false;
  let paidBySubscription = false;
  let finalPrice = price;

  if (superUser?.hasActiveSubscription) {
    const activeSubscription = superUser.subscriptions.find(
      (sub) => !sub.completed || sub.totalPaid < sub.totalPrice,
    );
    if (activeSubscription) {
      const hasLeftAppointments =
        activeSubscription.appointmentsIncluded -
          activeSubscription.doneAppointments >
        0;
      if (hasLeftAppointments) {
        const completed =
          activeSubscription.doneAppointments + 1 ===
          activeSubscription.appointmentsIncluded;
        const updatedSub = await upsertSubscription(
          activeSubscription.totalPrice,
          activeSubscription.totalPaid,
          activeSubscription.appointmentsIncluded,
          completed,
          clientId,
          activeSubscription.doneAppointments + 1,
          activeSubscription.id,
        );

        if (!updatedSub) {
          return NextResponse.json(
            { success: false, error: "Errore nell'aggiornamento dell'abbonamento" },
            { status: 500 },
          );
        }

        newAppointmentIsPaid = true;
        paidBySubscription = true;
        finalPrice = Number(
          activeSubscription.totalPrice / activeSubscription.appointmentsIncluded,
        );
      }
    }
  }

  const created = await prisma.appointment.create({
    data: {
      date,
      time,
      price: finalPrice,
      userId: clientId,
      status: "Confermato",
      paid: newAppointmentIsPaid,
      paidBySubscription,
      location,
    },
  });

  return NextResponse.json({ success: !!created });
}


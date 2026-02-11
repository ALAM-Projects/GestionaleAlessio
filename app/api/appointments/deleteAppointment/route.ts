import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { appointmentId }: { appointmentId: string } = body;

  if (!appointmentId) {
    return NextResponse.json(
      { success: false, error: "Missing appointmentId" },
      { status: 400 },
    );
  }

  await prisma.appointment.delete({
    where: {
      id: appointmentId,
    },
  });

  return NextResponse.json({ success: true });
}


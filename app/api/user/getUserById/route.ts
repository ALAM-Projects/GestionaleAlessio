import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extendUser } from "@/prisma/user-extension";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json(
      { error: "Missing clientId" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: clientId,
    },
    include: {
      appointments: true,
      subscriptions: true,
    },
  });

  if (!user) {
    return NextResponse.json(null);
  }

  if (user.appointments) {
    user.appointments.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }
  if (user.subscriptions) {
    user.subscriptions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  const superUser = extendUser(user);

  return NextResponse.json(superUser);
}


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(subscriptions);
}


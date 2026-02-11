import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function jsonBigIntSafe(data: unknown) {
  return new NextResponse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export async function GET() {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return jsonBigIntSafe(subscriptions);
}


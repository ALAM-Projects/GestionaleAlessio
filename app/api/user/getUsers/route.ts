import { NextResponse } from "next/server";
import { extendArrayOfUsers } from "@/prisma/user-extension";
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
  const initialUsers = await prisma.user.findMany({
    include: {
      appointments: true,
    },
  });

  const users = extendArrayOfUsers(initialUsers);

  return jsonBigIntSafe(users);
}


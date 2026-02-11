import { NextResponse } from "next/server";
import { extendArrayOfUsers } from "@/prisma/user-extension";
import prisma from "@/lib/prisma";

export async function GET() {
  const initialUsers = await prisma.user.findMany();

  const users = extendArrayOfUsers(initialUsers);

  const result = users.map((user) => ({
    id: user.id,
    fullName: user.fullName,
  }));

  return NextResponse.json(result);
}


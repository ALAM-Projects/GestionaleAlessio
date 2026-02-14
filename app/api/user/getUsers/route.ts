import { NextResponse } from "next/server";
import { getUsers } from "@/app/api/user/getUsers";

export async function GET() {
  const users = await getUsers();
  return NextResponse.json(users);
}


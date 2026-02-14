import { NextResponse } from "next/server";
import { getUsersList } from "@/app/api/user/getUsersList";

export async function GET() {
  const result = await getUsersList();
  return NextResponse.json(result);
}


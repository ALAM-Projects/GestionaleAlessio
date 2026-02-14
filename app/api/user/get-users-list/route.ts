import { NextResponse } from "next/server";
import { getUsersList } from "@/app/api/user/getUsersList";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getUsersList();
  return NextResponse.json(result);
}


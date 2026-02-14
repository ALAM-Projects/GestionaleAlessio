import { NextResponse } from "next/server";
import { getStats } from "@/app/api/dashboard/getStats";

export async function GET() {
  const stats = await getStats();
  return NextResponse.json(stats);
}


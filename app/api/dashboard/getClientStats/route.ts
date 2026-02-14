import { NextResponse } from "next/server";
import { getClientStats } from "@/app/api/dashboard/getClientStats";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json(
      { error: "Missing clientId" },
      { status: 400 },
    );
  }

  const stats = await getClientStats(clientId);
  return NextResponse.json(stats);
}


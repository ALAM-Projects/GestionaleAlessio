import { NextResponse } from "next/server";
import { getUserById } from "@/app/api/user/getUserById";

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

  const user = await getUserById(clientId);
  return NextResponse.json(user);
}


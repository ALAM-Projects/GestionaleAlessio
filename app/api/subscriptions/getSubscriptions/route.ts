import { NextResponse } from "next/server";
import { getSubscriptions } from "@/app/api/subscriptions/getSubscriptions";

export async function GET() {
  const subscriptions = await getSubscriptions();
  return NextResponse.json(subscriptions);
}


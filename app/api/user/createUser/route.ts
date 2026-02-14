import { NextResponse } from "next/server";
import { createUser } from "@/app/api/user/createUser";

export async function POST(request: Request) {
  const clientData: ClientDataProps = await request.json();

  try {
    const result = await createUser(clientData);

    if (typeof result === "string") {
      return NextResponse.json({ message: result }, { status: 409 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { message: "Errore nella creazione utente" },
      { status: 500 },
    );
  }
}


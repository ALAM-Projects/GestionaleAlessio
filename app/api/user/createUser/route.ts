import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const clientData: ClientDataProps = await request.json();

  try {
    const newUser = await prisma.user.create({
      data: {
        name: clientData.name,
        surname: clientData.surname,
        phone: clientData.phone,
        weight: clientData.weight,
        height: clientData.height,
        goal: clientData.goal,
        age: clientData.age,
        injuries: clientData.injuries,
        surgeries: clientData.surgeries,
        sex: clientData.sex,
        currentlyTraining: clientData.currentlyTraining,
        currentTrainingRate: clientData.currentTrainingRate,
        currentSport: clientData.currentSport,
        personalTraining: clientData.personalTraining,
        inactivityPeriod: clientData.inactivityPeriod,
        inactivityReason: clientData.inactivityReason,
        problems: clientData.problems,
      },
    });

    return NextResponse.json(newUser);
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        {
          message:
            "I tuoi dati sono già presenti. Una volta completata la scheda di anamnesi non occorre compilarla nuovamente.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json({ message: "Errore nella creazione utente" }, { status: 500 });
  }
}


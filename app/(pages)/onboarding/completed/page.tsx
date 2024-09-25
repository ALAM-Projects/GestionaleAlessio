"use client";
import OnboardingLayout from "@/app/(layouts)/onboarding";
import Image from "next/image";

export default function Onboarding() {
  return (
    <OnboardingLayout>
      <Image
        alt="check-icon"
        src="/approve-icon-animated.gif"
        height={150}
        width={150}
        className="mx-auto"
      />
      <h1 className="text-4xl text-primary text-center font-bold">
        Grazie per aver inserito tutti i dati richiesti!
      </h1>
      <p className="text-center  mt-5">
        Il processo è terminato, riceverai un promemoria tramite SMS il giorno
        prima del tuo allenamento.
      </p>
    </OnboardingLayout>
  );
}

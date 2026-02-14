"use client";
import OnboardingLayout from "@/app/(layouts)/onboarding";
import Image from "next/image";

export default function Onboarding() {
  return (
    <OnboardingLayout>
      {/* <Image
        alt="check-icon"
        src="/approve-icon-animated.gif"
        height={150}
        width={150}
        className="mx-auto"
      /> */}
      <h1 className="text-4xl text-neutral-200 text-center font-bold">
        Il processo è terminato.
      </h1>
      <p className="text-neutral-200 mt-3 mb-5 text-center">
        Grazie per aver inserito tutti i dati richiesti!
      </p>
    </OnboardingLayout>
  );
}

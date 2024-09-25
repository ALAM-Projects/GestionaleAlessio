"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { use, useState } from "react";

import { useRouter } from "next/navigation";
import { updateUser } from "@/app/actions/user/updateUser";
import OnboardingLayout from "@/app/(layouts)/onboarding";
import { Textarea } from "@/components/ui/textarea";

export default function Onboarding({ searchParams }: SearchParamProps) {
  const [clientData, setClientData] = useState<ClientDataProps>({
    name: "",
    surname: "",
    phone: 0,
    weight: 0,
    height: 0,
    goal: "",
    age: 0,
    injuries: "",
    surgeries: "",
  });

  const router = useRouter();

  // TODO: add validation
  const handleClientInfo = (value: string | number, name: string) => {
    console.log(name, value);

    setClientData({ ...clientData, [name]: value });

    console.log(clientData);
  };

  const handleSaveClientInfo = async () => {
    const userId = Array.isArray(searchParams.userId)
      ? searchParams.userId[0]
      : searchParams.userId || "";
    const updatedUser = await updateUser(clientData, userId);

    if (updatedUser) {
      router.push("/completed");
    }
  };

  return (
    <OnboardingLayout>
      <h1 className="text-5xl mt-10 text-white text-center font-bold">
        Grazie per aver inserito i tuoi dati!
      </h1>
      <p className="text-center text-white mt-5">
        Il processo è terminato, riceverai un SMS sul numero comunicato in
        precedenza il giorno prima del tuo allenamento.
      </p>
    </OnboardingLayout>
  );
}

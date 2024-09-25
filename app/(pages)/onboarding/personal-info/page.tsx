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
      router.push("/onboarding/completed");
    }
  };

  return (
    <OnboardingLayout>
      <h1 className="text-5xl mt-10 text-white text-center font-bold">
        Inserisci i tuoi dati
      </h1>
      <div className="grid mt-5 w-full max-w-sm items-center gap-1.5 mx-auto">
        <Label htmlFor="age" className="text-white">
          Età
        </Label>
        <Input
          type="number"
          id="age"
          name="age"
          placeholder="Età"
          onChange={(e) =>
            handleClientInfo(Number(e.target.value), e.target.name)
          }
        />
      </div>
      <div className="grid mt-5 w-full max-w-sm items-center gap-1.5 mx-auto">
        <Label htmlFor="weight" className="text-white">
          Peso (kg)
        </Label>
        <Input
          type="text"
          id="weight"
          name="weight"
          placeholder="Peso"
          onChange={(e) =>
            handleClientInfo(Number(e.target.value), e.target.name)
          }
        />
      </div>
      <div className="grid mt-5 w-full max-w-sm items-center gap-1.5 mx-auto">
        <Label htmlFor="weight" className="text-white">
          Altezza (cm)
        </Label>
        <Input
          type="number"
          id="height"
          name="weight"
          placeholder="Altezza"
          onChange={(e) =>
            handleClientInfo(Number(e.target.value), e.target.name)
          }
        />
      </div>
      <div className="grid mt-5 w-full max-w-sm items-center gap-1.5 mx-auto">
        <Label htmlFor="goal" className="text-white">
          Obiettivi
        </Label>
        <Textarea
          placeholder="Scrivi gli obiettivi che vuoi raggiungere con l'allenamento"
          id="goal"
          name="goal"
          onChange={(e) => handleClientInfo(e.target.value, e.target.name)}
        />
      </div>
      <div className="grid mt-5 w-full max-w-sm items-center gap-1.5 mx-auto">
        <Label htmlFor="injuries" className="text-white">
          Infortuni
        </Label>
        <Textarea
          placeholder="Scrivi eventuali infortuni"
          id="injuries"
          name="injuries"
          onChange={(e) => handleClientInfo(e.target.value, e.target.name)}
        />
      </div>
      <div className="grid mt-5 w-full max-w-sm items-center gap-1.5 mx-auto">
        <Label htmlFor="surgeries" className="text-white">
          Operazioni
        </Label>
        <Textarea
          placeholder="Scrivi eventuali operazioni"
          id="surgeries"
          name="surgeries"
          onChange={(e) => handleClientInfo(e.target.value, e.target.name)}
        />
      </div>
      <div className="text-center">
        <Button
          className="mt-5 w-full max-w-sm "
          onClick={() => handleSaveClientInfo()}
        >
          Invia
        </Button>
      </div>
    </OnboardingLayout>
  );
}

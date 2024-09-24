"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { use, useState } from "react";

import { useRouter } from "next/navigation";
import { updateUser } from "@/app/actions/user/updateUser";

export default function Onboarding({ searchParams }: SearchParamProps) {
  const userId = searchParams.userId;

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
    const updatedUser = await updateUser(clientData, userId);

    if (updatedUser) {
      router.push("/completed");
    }
  };

  return (
    <div className="grid xl:grid-cols-12 min-h-screen">
      <div className="col-span-7 w-full py-10">
        <h1 className="text-5xl text-center font-bold">
          Inserisci i tuoi dati
        </h1>
        <div className="grid mt-10 w-full max-w-sm items-center gap-1.5 mx-auto">
          <Label htmlFor="email">Età</Label>
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
          <Label htmlFor="email">Peso (kg)</Label>
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
          <Label htmlFor="email">Altezza (cm)</Label>
          <Input
            type="number"
            id="height"
            name="height"
            placeholder="Altezza"
            onChange={(e) =>
              handleClientInfo(Number(e.target.value), e.target.name)
            }
          />
        </div>
        <div className="grid mt-5 w-full max-w-sm items-center gap-1.5 mx-auto">
          <Label htmlFor="email">Obiettivi</Label>
          <Input
            type="text"
            id="goal"
            name="goal"
            placeholder="Obiettivi"
            onChange={(e) => handleClientInfo(e.target.value, e.target.name)}
          />
        </div>
        <div className="grid mt-5 w-full max-w-sm items-center gap-1.5 mx-auto">
          <Label htmlFor="email">Infortuni</Label>
          <Input
            type="text"
            id="injuries"
            name="injuries"
            placeholder="Infortuni"
            onChange={(e) => handleClientInfo(e.target.value, e.target.name)}
          />
        </div>
        <div className="grid mt-5 w-full max-w-sm items-center gap-1.5 mx-auto">
          <Label htmlFor="email">Operazioni</Label>
          <Input
            type="text"
            id="surgeries"
            name="surgeries"
            placeholder="Operazioni"
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
      </div>
      <div className="col-span-5 w-full bg-primary"></div>
    </div>
  );
}

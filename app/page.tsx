"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { use, useState } from "react";
import { createUser } from "./actions/createUser";
import { useRouter } from "next/navigation";

export default function Home() {
  const [clientData, setClientData] = useState({
    name: "",
    surname: "",
    phone: "",
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
    setClientData({ ...clientData, [name]: value });

    console.log(clientData);
  };

  const handleSaveClientInfo = async () => {
    const newUser = await createUser(clientData);

    if (newUser) {
      router.push("/onboarding");
    }
  };

  return (
    <div className="grid xl:grid-cols-12 min-h-screen">
      <div className="col-span-7 w-full py-10">
        <h1 className="text-5xl text-center font-bold">
          Inserisci i tuoi dati
        </h1>
        <div className="grid mt-10 w-full max-w-sm items-center gap-1.5 mx-auto">
          <Label htmlFor="email">Nome</Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Nome"
            onChange={(e) => handleClientInfo(e.target.value, e.target.name)}
          />
        </div>
        <div className="grid mt-5 w-full max-w-sm items-center gap-1.5 mx-auto">
          <Label htmlFor="email">Cognome</Label>
          <Input
            type="text"
            id="surname"
            name="surname"
            placeholder="Cognome"
            onChange={(e) => handleClientInfo(e.target.value, e.target.name)}
          />
        </div>
        <div className="grid mt-5 w-full max-w-sm items-center gap-1.5 mx-auto">
          <Label htmlFor="email">Telefono</Label>
          <Input
            type="number"
            id="phone"
            name="phone"
            placeholder="Telefono"
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

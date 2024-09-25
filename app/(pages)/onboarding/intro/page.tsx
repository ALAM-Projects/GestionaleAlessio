"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/actions/user/createUser";
import OnboardingLayout from "@/app/(layouts)/onboarding";
import Link from "next/link";
import { AdminModal } from "@/components/library/admin-modal";

export default function Intro({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === "true";

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
    setClientData({ ...clientData, [name]: value });
  };

  const handleSaveClientInfo = async () => {
    const newUser = await createUser(clientData);

    if (newUser) {
      router.push(`/onboarding/personal-info?userId=${newUser.id}`);
    }
  };

  return (
    <OnboardingLayout>
      {isAdmin && <AdminModal />}
      <h1 className="text-5xl mt-10 text-center font-bold">
        Inserisci i tuoi dati
      </h1>
      <div className="grid mt-6 w-full max-w-sm items-center gap-1.5 mx-auto">
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
          onChange={(e) =>
            handleClientInfo(Number(e.target.value), e.target.name)
          }
        />
      </div>
      <div className="text-center">
        <Button
          className="mt-5 w-full max-w-sm"
          onClick={() => handleSaveClientInfo()}
        >
          Invia
        </Button>
      </div>
      <div className="text-center mt-5">
        <Link href="?admin=true" className="font-bold">
          Admin
        </Link>
      </div>
    </OnboardingLayout>
  );
}

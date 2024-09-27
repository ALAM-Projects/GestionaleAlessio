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
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Intro({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === "true";

  const [error, setError] = useState<string>("");
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
    sex: "",
    currentlyTraining: "",
    personalTraining: "",
    problems: "",
  });

  const router = useRouter();

  // TODO: add validation
  const handleClientInfo = (value: string | number, name: string) => {
    setClientData({ ...clientData, [name]: value });
  };

  const handleSaveClientInfo = async () => {
    const response = await createUser(clientData);

    if (typeof response === "string") {
      setError(response);
    } else {
      router.push(`/onboarding/personal-info?userId=${response.id}`);
    }
  };

  return (
    <OnboardingLayout>
      {isAdmin && <AdminModal />}

      <h1 className="text-4xl text-white text-center font-bold">
        Informazioni personali
      </h1>
      <p className="text-neutral-400 mt-3 mb-5 text-center">
        Inserisci tutte le informazioni richieste per procedere con la
        compilazione della tua scheda di anamnesi
      </p>
      {error && (
        <Card className="bg-red-500 border-red-500">
          <div className="p-5 text-center font-bold text-white">{error}</div>
        </Card>
      )}
      <div className="grid grid-cols-12 gap-x-4 gap-y-2 mt-5">
        <div className="col-span-12 xl:col-span-6 items-center gap-1.5">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="email">
            Nome
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            className="text-white text-md"
            placeholder="Il tuo nome"
            onChange={(e) => handleClientInfo(e.target.value, e.target.name)}
          />
        </div>
        <div className="col-span-12 xl:col-span-6 items-center gap-1.5 ">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="email">
            Cognome
          </Label>
          <Input
            type="text"
            id="surname"
            name="surname"
            className="text-white text-md"
            placeholder="Il tuo cognome"
            onChange={(e) => handleClientInfo(e.target.value, e.target.name)}
          />
        </div>
        <div className="col-span-12 xl:col-span-6 items-center gap-1.5">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="email">
            Telefono
          </Label>
          <Input
            type="number"
            id="phone"
            name="phone"
            className="text-white text-md"
            placeholder="Il tuo numero di telefono"
            onChange={(e) =>
              handleClientInfo(Number(e.target.value), e.target.name)
            }
          />
        </div>
        <div className="col-span-12 xl:col-span-6 items-center gap-1.5">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="age">
            Età
          </Label>
          <Input
            type="number"
            className="text-white text-md"
            id="age"
            name="age"
            placeholder="La tua età"
            onChange={(e) =>
              handleClientInfo(Number(e.target.value), e.target.name)
            }
          />
        </div>
        <div className="col-span-12 xl:col-span-6 items-center gap-1.5 ">
          <Label
            className="text-neutral-400 font-bold text-md"
            htmlFor="height"
          >
            Altezza (cm)
          </Label>
          <Input
            type="number"
            className="text-white text-md"
            id="height"
            name="height"
            placeholder="Altezza"
            onChange={(e) =>
              handleClientInfo(Number(e.target.value), e.target.name)
            }
          />
        </div>

        <div className="col-span-12 xl:col-span-6 items-center gap-1.5 ">
          <Label
            className="text-neutral-400 font-bold text-md"
            htmlFor="weight"
          >
            Peso (kg)
          </Label>
          <Input
            type="number"
            className="text-white text-md"
            id="weight"
            name="weight"
            placeholder="Peso"
            onChange={(e) =>
              handleClientInfo(Number(e.target.value), e.target.name)
            }
          />
        </div>
        <div className="col-span-12 xl:col-span-6 items-center gap-1.5 mt-1">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="sex">
            Sesso
          </Label>
          <RadioGroup
            defaultValue="option-one"
            className="flex mt-3"
            id="sex"
            name="sex"
            onValueChange={(e) => handleClientInfo(e, "sex")}
          >
            <div className="flex items-center space-x-2 text-white text-md">
              <RadioGroupItem
                value="Maschio"
                id="Maschio"
                className="text-white border-white"
              />
              <Label htmlFor="M" className="text-md">
                M
              </Label>
            </div>
            <div className="flex items-center space-x-2 text-white text-md">
              <RadioGroupItem
                value="Femmina"
                id="Femmina"
                className="text-white border-white"
              />
              <Label htmlFor="F" className="text-md">
                F
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className="text-center mt-5">
        <Button
          className="mt-5 w-full max-w-sm bg-[#550000] hover:bg-[#550000] text-md font-bold"
          onClick={() => handleSaveClientInfo()}
        >
          Continua
        </Button>
      </div>
      <div className="text-center mt-5">
        <Link href="?admin=true" className="font-bold text-white">
          Admin
        </Link>
      </div>
    </OnboardingLayout>
  );
}

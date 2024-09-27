"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    sex: "",
    currentlyTraining: "",
    currentSport: "",
    personalTraining: "",
    problems: "",
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
      <h1 className="text-4xl text-white text-center font-bold">
        Scheda di anamnesi
      </h1>
      <p className="text-neutral-400 mt-3 text-center">
        Inserisci tutte le informazioni richieste per completare la compilazione
        della tua scheda di anamnesi
      </p>
      <div className="grid grid-cols-12 gap-2 mt-10">
        <div className="col-span-12 items-center gap-1.5 mt-1">
          <Label
            className="text-neutral-400 font-bold text-md"
            htmlFor="currentlyTraining"
          >
            Attualmente ti stai allenando?
          </Label>
          <RadioGroup
            defaultValue="option-one"
            className="flex mt-3"
            id="currentlyTraining"
            name="currentlyTraining"
            onValueChange={(e) => handleClientInfo(e, "currentlyTraining")}
          >
            <div className="flex items-center space-x-2 text-white text-lg">
              <RadioGroupItem
                value="Si"
                id="Si"
                className="text-white border-white"
              />
              <Label htmlFor="Si" className="text-md">
                Si
              </Label>
            </div>
            <div className="flex items-center space-x-2 text-white text-lg">
              <RadioGroupItem
                value="No"
                id="No"
                className="text-white border-white"
              />
              <Label htmlFor="No" className="text-md">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        {clientData.currentlyTraining === "Si" ? (
          <>
            <div className="col-span-12 items-center gap-1.5 mt-1">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="currentSport"
              >
                In quale disciplina?
              </Label>
              <Textarea
                placeholder="Scrivi quale disciplina stai praticando"
                className="text-white text-md"
                id="currentSport"
                name="currentSport"
                onChange={(e) =>
                  handleClientInfo(e.target.value, e.target.name)
                }
              />
            </div>
            <div className="col-span-12 items-center gap-1.5 mt-1">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="currentTrainingRate"
              >
                Quanto spesso?
              </Label>
              <Textarea
                placeholder="Eg: 3 volte a settimana, 2 volte al mese"
                className="text-white text-md"
                id="currentTrainingRate"
                name="currentTrainingRate"
                onChange={(e) =>
                  handleClientInfo(e.target.value, e.target.name)
                }
              />
            </div>
            <div className="col-span-12 items-center gap-1.5 mt-1 mb-3">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="personalTraining"
              >
                Hai mai fatto sedute di PT?
              </Label>
              <RadioGroup
                defaultValue="option-one"
                className="flex mt-3"
                id="personalTraining"
                name="personalTraining"
                onValueChange={(e) => handleClientInfo(e, "personalTraining")}
              >
                <div className="flex items-center space-x-2 text-white text-lg">
                  <RadioGroupItem
                    value="Si"
                    id="Si"
                    className="text-white border-white"
                  />
                  <Label htmlFor="Si" className="text-md">
                    Si
                  </Label>
                </div>
                <div className="flex items-center space-x-2 text-white text-lg">
                  <RadioGroupItem
                    value="No"
                    id="No"
                    className="text-white border-white"
                  />
                  <Label htmlFor="No" className="text-md">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </>
        ) : null}

        {clientData.currentlyTraining === "No" ? (
          <>
            <div className="col-span-12  items-center gap-1.5 mt-1">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="inactivityPeriod"
              >
                Da quanto sei inattivo?
              </Label>
              <Textarea
                placeholder="Eg: 3 mesi, 1 anno"
                className="text-white text-md"
                id="currentinactivityPeriodSport"
                name="inactivityPeriod"
                onChange={(e) =>
                  handleClientInfo(e.target.value, e.target.name)
                }
              />
            </div>
            <div className="col-span-12 items-center gap-1.5 mt-1">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="inactivityReason"
              >
                Perché hai interrotto?
              </Label>
              <Textarea
                placeholder="Scrivi il motivo per cui hai interrotto, lasciare vuoto se "
                className="text-white text-md"
                id="inactivityReason"
                name="inactivityReason"
                onChange={(e) =>
                  handleClientInfo(e.target.value, e.target.name)
                }
              />
            </div>
          </>
        ) : null}

        <div className="col-span-12  items-center gap-1.5 mt-2">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="goal">
            Obiettivi
          </Label>
          <Textarea
            placeholder="Eg: Dimagrire, Aumentare la massa muscolare, Maggiore mobilità, Mal di schiena, ecc"
            className="text-white text-md"
            id="goal"
            name="goal"
            onChange={(e) => handleClientInfo(e.target.value, e.target.name)}
          />
        </div>
        <div className="col-span-12  items-center gap-1.5 mt-2">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="goal">
            Cosa ti ha spinto a scegliere di perseguire questi obiettivi?
          </Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona una risposta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Non mi sento bene fisicamente">
                Non mi sento bene fisicamente
              </SelectItem>
              <SelectItem value="Voglio cambiare le mie abitudini">
                Voglio cambiare le mie abitudini
              </SelectItem>
              <SelectItem value="Voglio migliorare la qualità della mia vita">
                Voglio migliorare la qualità della mia vita
              </SelectItem>
              <SelectItem value="Ho dei dolori fisici da migliorare">
                Ho dei dolori fisici da migliorare
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-12   items-center gap-1.5 ">
          <Label
            className="text-neutral-400 font-bold text-md"
            htmlFor="problems"
          >
            Problematiche a livello articolare
          </Label>
          <Textarea
            placeholder="Scrivi eventuali problematiche (eg: Ernie, Shiacciamenti, Protusioni, Contropatie, ecc)"
            className="text-white text-md"
            id="problems"
            name="problems"
            onChange={(e) => handleClientInfo(e.target.value, e.target.name)}
          />
        </div>
        <div className="col-span-12   items-center gap-1.5 ">
          <Label
            className="text-neutral-400 font-bold text-md"
            htmlFor="injuries"
          >
            Infortuni
          </Label>
          <Textarea
            placeholder="Scrivi eventuali infortuni"
            className="text-white text-md"
            id="injuries"
            name="injuries"
            onChange={(e) => handleClientInfo(e.target.value, e.target.name)}
          />
        </div>
        <div className="col-span-12 items-center gap-1.5 ">
          <Label
            className="text-neutral-400 font-bold text-md"
            htmlFor="surgeries"
          >
            Operazioni
          </Label>
          <Textarea
            placeholder="Scrivi eventuali operazioni"
            className="text-white text-md"
            id="surgeries"
            name="surgeries"
            onChange={(e) => handleClientInfo(e.target.value, e.target.name)}
          />
        </div>
      </div>
      <div className="text-center mt-5">
        <Button
          className="mt-5 w-full bg-[#550000] hover:bg-[#550000] text-md font-bold"
          onClick={() => handleSaveClientInfo()}
        >
          Continua
        </Button>
      </div>
    </OnboardingLayout>
  );
}

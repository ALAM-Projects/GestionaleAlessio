"use client";

import DashboardLayout from "@/app/(layouts)/dashboard";
import { getUserById } from "@/app/actions/user/getUserById";
import { AppointmentsTable } from "@/components/library/appointments.table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Spinner from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { UserWithFullName } from "@/prisma/user-extension";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppointmentModal } from "@/components/library/appointment-modal";

const ClientPage = ({ params, searchParams }: SearchParamProps) => {
  const clientId = params.clientId;
  const appointmentModal = searchParams?.appointment === "true";

  const [user, setUser] = useState<UserWithFullName>();
  const router = useRouter();

  useEffect(() => {
    getClient();
  }, []);

  const getClient = async () => {
    const user = await getUserById(clientId);
    if (user) {
      setUser(user);
    }
    return;
  };

  return (
    <DashboardLayout>
      {user ? (
        // PERSONAL-INFO
        <>
          <h1 className="text-4xl text-white text-center font-bold">
            {user?.fullName}
          </h1>
          <h3 className="text-2xl lg:text-4xl font-bold text-white mt-10">
            Informazioni personali
          </h3>
          <div className="grid grid-cols-12 gap-x-4 gap-y-2 mt-2">
            <div className="col-span-12 xl:col-span-3 items-center gap-1.5">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="email"
              >
                Nome
              </Label>
              <Input
                value={user?.name}
                disabled
                type="text"
                id="name"
                name="name"
                className="text-primary text-md"
                placeholder="Il tuo nome"
                // onChange={(e) => handleClientInfo(e.target.value, e.target.name)}
              />
            </div>
            <div className="col-span-12 xl:col-span-3 items-center gap-1.5 ">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="email"
              >
                Cognome
              </Label>
              <Input
                value={user?.surname}
                disabled
                type="text"
                id="surname"
                name="surname"
                className="text-md"
                placeholder="Il tuo cognome"
                // onChange={(e) => handleClientInfo(e.target.value, e.target.name)}
              />
            </div>
            <div className="col-span-12 xl:col-span-3 items-center gap-1.5">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="email"
              >
                Telefono
              </Label>
              <Input
                value={Number(user?.phone)}
                disabled
                type="number"
                id="phone"
                name="phone"
                className=" text-md"
                placeholder="Il tuo numero di telefono"
                // onChange={(e) =>
                //   // handleClientInfo(Number(e.target.value), e.target.name)
                // }
              />
            </div>
            <div className="col-span-12 xl:col-span-3 items-center gap-1.5">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="age"
              >
                Età
              </Label>
              <Input
                value={user?.age}
                disabled
                type="number"
                className="text-md"
                id="age"
                name="age"
                placeholder="La tua età"
                // onChange={(e) =>
                //   // handleClientInfo(Number(e.target.value), e.target.name)
                // }
              />
            </div>
            <div className="col-span-12 xl:col-span-3 items-center gap-1.5 ">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="height"
              >
                Altezza (cm)
              </Label>
              <Input
                value={user?.height}
                disabled
                type="number"
                className="text-md"
                id="height"
                name="height"
                placeholder="Altezza"
                // onChange={(e) =>
                //   // handleClientInfo(Number(e.target.value), e.target.name)
                // }
              />
            </div>

            <div className="col-span-12 xl:col-span-3 items-center gap-1.5 ">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="weight"
              >
                Peso (kg)
              </Label>
              <Input
                value={user?.weight}
                disabled
                type="number"
                className="text-md"
                id="weight"
                name="weight"
                placeholder="Peso"
                // onChange={(e) =>
                //   // handleClientInfo(Number(e.target.value), e.target.name)
                // }
              />
            </div>
            <div className="col-span-12 xl:col-span-3 items-center gap-1.5 mt-1">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="sex"
              >
                Sesso
              </Label>
              <RadioGroup
                disabled
                value={user?.sex}
                className="flex mt-3"
                id="sex"
                name="sex"
                // onValueChange={(e) => handleClientInfo(e, "sex")}
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
          {/* ANAMNESI */}
          <h3 className="text-xl lg:text-2xl text-white mt-10">
            Scheda di anamnesi
          </h3>

          <div className="grid grid-cols-12 gap-2 mt-2">
            <div className="col-span-12 items-center gap-1.5 mt-1">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="currentlyTraining"
              >
                Attualmente ti stai allenando?
              </Label>
              <RadioGroup
                value={user.currentlyTraining}
                disabled
                className="flex mt-3"
                id="currentlyTraining"
                name="currentlyTraining"
                // onValueChange={(e) => handleClientInfo(e, "currentlyTraining")}
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

            {user.currentlyTraining === "Si" ? (
              <>
                <div className="col-span-12 xl:col-span-3 items-center gap-1.5 mt-1">
                  <Label
                    className="text-neutral-400 font-bold text-md"
                    htmlFor="currentSport"
                  >
                    In quale disciplina?
                  </Label>
                  <Textarea
                    value={user.currentSport ?? ""}
                    disabled
                    placeholder="Scrivi quale disciplina stai praticando"
                    className="text-md"
                    id="currentSport"
                    name="currentSport"
                    // onChange={(e) =>
                    //   handleClientInfo(e.target.value, e.target.name)
                    // }
                  />
                </div>
                <div className="col-span-12 xl:col-span-3 items-center gap-1.5 mt-1">
                  <Label
                    className="text-neutral-400 font-bold text-md"
                    htmlFor="currentTrainingRate"
                  >
                    Quanto spesso?
                  </Label>
                  <Textarea
                    value={user.currentTrainingRate ?? ""}
                    disabled
                    placeholder="Eg: 3 volte a settimana, 2 volte al mese"
                    className="text-md"
                    id="currentTrainingRate"
                    name="currentTrainingRate"
                    // onChange={(e) =>
                    //   handleClientInfo(e.target.value, e.target.name)
                    // }
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
                    value={user.personalTraining ?? ""}
                    disabled
                    className="flex mt-3"
                    id="personalTraining"
                    name="personalTraining"
                    // onValueChange={(e) =>
                    //   handleClientInfo(e, "personalTraining")
                    // }
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

            {user.currentlyTraining === "No" ? (
              <>
                <div className="col-span-12 xl:col-span-3  items-center gap-1.5 mt-1">
                  <Label
                    className="text-neutral-400 font-bold text-md"
                    htmlFor="inactivityPeriod"
                  >
                    Da quanto sei inattivo?
                  </Label>
                  <Textarea
                    value={user.inactivityPeriod ?? ""}
                    disabled
                    placeholder="Eg: 3 mesi, 1 anno"
                    className="text-md"
                    id="currentinactivityPeriodSport"
                    name="inactivityPeriod"
                    // onChange={(e) =>
                    //   handleClientInfo(e.target.value, e.target.name)
                    // }
                  />
                </div>
                <div className="col-span-12 xl:col-span-3 items-center gap-1.5 mt-1">
                  <Label
                    className="text-neutral-400 font-bold text-md"
                    htmlFor="inactivityReason"
                  >
                    Perché hai interrotto?
                  </Label>
                  <Textarea
                    value={user.inactivityReason ?? ""}
                    disabled
                    placeholder="Scrivi il motivo per cui hai interrotto, lasciare vuoto se "
                    className="text-md"
                    id="inactivityReason"
                    name="inactivityReason"
                    // onChange={(e) =>
                    //   handleClientInfo(e.target.value, e.target.name)
                    // }
                  />
                </div>
              </>
            ) : null}

            <div className="col-span-12 xl:col-span-3  items-center gap-1.5 mt-2">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="goal"
              >
                Obiettivi
              </Label>
              <Textarea
                value={user.goal ?? ""}
                placeholder="Eg: Dimagrire, Aumentare la massa muscolare, Maggiore mobilità, Mal di schiena, ecc"
                disabled
                className="text-md"
                id="goal"
                name="goal"
                // onChange={(e) =>
                //   handleClientInfo(e.target.value, e.target.name)
                // }
              />
            </div>
            <div className="col-span-12 xl:col-span-3 items-center gap-1.5 mt-2">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="goalReason"
              >
                Perchè perseguire questi obiettivi?
              </Label>
              <Textarea
                value={user?.goalReason ?? ""}
                disabled
                className="text-md"
                id="weight"
                name="weight"
                // onChange={(e) =>
                //   // handleClientInfo(Number(e.target.value), e.target.name)
                // }
              />
            </div>
            <div className="col-span-12 xl:col-span-3   items-center gap-1.5 mt-2">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="problems"
              >
                Problematiche a livello articolare
              </Label>
              <Textarea
                value={user.problems ?? ""}
                disabled
                placeholder="Scrivi eventuali problematiche (eg: Ernie, Shiacciamenti, Protusioni, Contropatie, ecc)"
                className=" text-md"
                id="problems"
                name="problems"
                // onChange={(e) =>
                //   handleClientInfo(e.target.value, e.target.name)
                // }
              />
            </div>
            <div className="col-span-12 xl:col-span-3   items-center gap-1.5 mt-2">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="injuries"
              >
                Infortuni
              </Label>
              <Textarea
                value={user.injuries ?? ""}
                disabled
                placeholder="Scrivi eventuali infortuni"
                className="text-md"
                id="injuries"
                name="injuries"
                // onChange={(e) =>
                //   handleClientInfo(e.target.value, e.target.name)
                // }
              />
            </div>
            <div className="col-span-12 xl:col-span-3 items-center gap-1.5 ">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="surgeries"
              >
                Operazioni
              </Label>
              <Textarea
                value={user.surgeries ?? ""}
                disabled
                placeholder="Scrivi eventuali operazioni"
                className="text-md"
                id="surgeries"
                name="surgeries"
                // onChange={(e) =>
                //   handleClientInfo(e.target.value, e.target.name)
                // }
              />
            </div>
          </div>
          {user.appointments.length ? (
            <>
              {appointmentModal && (
                <AppointmentModal
                  clientId={clientId}
                  getClient={getClient}
                  searchParams={searchParams}
                />
              )}
              <div className="flex justify-between items-center mt-10">
                <h2 className="text-2xl lg:text-4xl font-bold my-3 text-white">
                  Appuntamenti
                </h2>
                <Button
                  variant={"brand"}
                  onClick={() => router.push("?appointment=true")}
                >
                  Crea nuovo appuntamento
                </Button>
              </div>
              <AppointmentsTable
                appointments={user.appointments}
                withClient={false}
                clientId={clientId}
              />
            </>
          ) : null}
        </>
      ) : (
        <Spinner size="lg" color="border-white" />
      )}
    </DashboardLayout>
  );
};

export default ClientPage;

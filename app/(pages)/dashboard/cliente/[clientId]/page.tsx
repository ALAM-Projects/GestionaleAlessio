"use client";

import DashboardLayout from "@/app/(layouts)/dashboard";
import { getUserById } from "@/app/actions/user/getUserById";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Spinner from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  extendArrayOfUsersWithFullName,
  UserWithFullName,
} from "@/prisma/user-extension";
import { useEffect, useMemo, useState } from "react";
import { AppointmentModal } from "@/components/library/appointment-modal";

import { getClientStats } from "@/app/actions/dashboard/getClientStats";
import { clientCardStats } from "@/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUsers } from "@/app/actions/user/getUsers";
import AppointmentManager from "@/components/library/appointment-manager";
import { Appointment } from "@prisma/client";

const isClientPage = ({ params, searchParams }: SearchParamProps) => {
  const clientId = params.clientId;

  const [user, setUser] = useState<UserWithFullName>();
  const [stats, setStats] = useState<DashboardStats>();
  const [modalOpen, setModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<UserWithFullName[]>();
  const [appointmentData, setAppointmentData] = useState<Appointment>();

  useEffect(() => {
    getClientPageInfo();
    getAllUsers();
  }, []);

  const getClientPageInfo = async () => {
    const stats = await getClientStats(clientId);
    const user = await getUserById(clientId);

    stats && setStats(stats);
    user && setUser(user);
  };

  const getAllUsers = async () => {
    const partialUsers = await getUsers();

    const users = extendArrayOfUsersWithFullName(partialUsers);

    users && setAllUsers(users);
  };

  const paidAppointmentsNumber = useMemo(() => {
    return (
      user?.appointments?.filter((appointment) => appointment.paid).length || 0
    );
  }, [user?.appointments]);

  const allPaid = paidAppointmentsNumber === user?.appointments.length;
  const appointmentsToPay =
    user?.appointments && user?.appointments?.length - paidAppointmentsNumber;

  return (
    <DashboardLayout linkText={"Torna alla dashboard"} link={"/dashboard"}>
      {user && stats ? (
        // PERSONAL-INFO
        <>
          <div className="grid grid-cols-12 items-center mt-5 space-y-12 lg:space-y-0">
            <div className="h-full flex col-span-12 lg:col-span-5 gap-5 lg:gap-3 flex-wrap justify-between md:flex-row">
              {stats &&
                clientCardStats?.map((stat: CardStats) => {
                  return (
                    <Card
                      key={stat.id}
                      className="w-[46%] lg:w-[98%] xl:w-[48.5%] bg-tertiary text-white"
                    >
                      <CardHeader className="px-3 md:px-4">
                        <CardTitle>{stat.title}</CardTitle>
                        <CardDescription className="text-md">
                          {stat.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-3 md:px-5">
                        <h5 className="text-3xl lg:text-5xl font-bold">
                          {String(stats[stat.id as keyof DashboardStats])}
                        </h5>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
            <Card className="flex flex-col items-between lg:flex-row lg:justify-between col-span-12 lg:col-span-7 ml-auto w-[100%] lg:w-[98%] bg-brand/40 text-white  h-full">
              <div className="px-3 md:px-4">
                <CardHeader className="px-0">
                  {/* <span>CLIENTE:</span> */}
                  <CardTitle className="text-4xl">{user?.fullName}</CardTitle>
                </CardHeader>
                <Badge
                  className="text-md"
                  variant={allPaid ? "success" : "destructive"}
                >
                  {allPaid
                    ? "Pagamenti in regola"
                    : `Da pagare ${appointmentsToPay} appuntamenti`}
                </Badge>
              </div>
              <CardContent className="px-3 pb-0 pt-6 md:px-4 xl:p-6">
                <div className="text-xl ">
                  Telefono:{" "}
                  <span className="font-bold">{Number(user?.phone)}</span>
                </div>
                <div className="text-xl ">
                  Età: <span className="font-bold">{Number(user?.age)}</span>
                </div>
                <div className="text-xl ">
                  Altezza:{" "}
                  <span className="font-bold">{Number(user?.height)} cm</span>
                </div>
                <div className="text-xl ">
                  Peso:{" "}
                  <span className="font-bold">{Number(user?.weight)} kg</span>
                </div>
                <div className="text-xl ">
                  Sesso: <span className="font-bold">{user?.sex}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ANAMNESI */}
          <h3 className="text-3xl lg:text-4xl font-bold text-white mt-16">
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

          <AppointmentModal
            clientId={clientId}
            searchParams={searchParams}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            allUsers={allUsers}
            reloadPageData={getClientPageInfo}
            appointmentData={appointmentData}
            setAppointmentData={setAppointmentData}
          />
          <AppointmentManager
            appointments={user.appointments}
            clientId={clientId}
            withClient={false}
            getPageInfo={getClientPageInfo}
            setModalOpen={setModalOpen}
            setAppointmentData={setAppointmentData}
          />
        </>
      ) : (
        <Spinner size="lg" color="border-white" />
      )}
    </DashboardLayout>
  );
};

export default isClientPage;

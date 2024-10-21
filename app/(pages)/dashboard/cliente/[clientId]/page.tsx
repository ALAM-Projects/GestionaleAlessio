"use client";

import DashboardLayout from "@/app/(layouts)/dashboard";
import { getUserById } from "@/app/actions/user/getUserById";
import Spinner from "@/components/ui/spinner";
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
import AnamnesiRecap from "@/components/library/anamnesi-recap";

const isClientPage = ({ params }: SearchParamProps) => {
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

  const confirmedAppointments = useMemo(() => {
    return user?.appointments?.filter(
      (appointment) => appointment.status === "Confermato"
    );
  }, [user?.appointments]);

  console.log(confirmedAppointments);

  const paidAppointmentsNumber = useMemo(() => {
    return (
      confirmedAppointments?.filter((appointment) => appointment.paid).length ||
      0
    );
  }, [user?.appointments]);

  const allPaid = paidAppointmentsNumber === confirmedAppointments?.length;
  const appointmentsToPay =
    confirmedAppointments &&
    confirmedAppointments?.length - paidAppointmentsNumber;

  return (
    <DashboardLayout linkText={"Torna alla dashboard"} link={"/dashboard"}>
      <AppointmentModal
        clientId={clientId}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        allUsers={allUsers}
        reloadPageData={getClientPageInfo}
        appointmentData={appointmentData}
        setAppointmentData={setAppointmentData}
      />
      {user && stats ? (
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
          <AnamnesiRecap user={user} />
          {/* ANAMNESI */}

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

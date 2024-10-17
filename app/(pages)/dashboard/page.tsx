"use client";

import { withAuth } from "@/app/(hocs)/with-auth";
import { getStats } from "@/app/actions/dashboard/getStats";
import { UsersTable } from "@/components/library/users.table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import Spinner from "@/components/ui/spinner";
import { dashboardCardStats } from "@/data/index";
import { Appointment } from "@prisma/client";
import { getUsers } from "@/app/actions/user/getUsers";
import { getAppointments } from "@/app/actions/appointments/getAppointments";
import DashboardLayout from "@/app/(layouts)/dashboard";
import { AppointmentModal } from "@/components/library/appointment-modal";
import {
  extendArrayOfUsersWithFullName,
  UserWithFullName,
} from "@/prisma/user-extension";
import AppointmentManager from "@/components/library/appointment-manager";

function Dashboard({ searchParams }: SearchParamProps) {
  const [stats, setStats] = useState<DashboardStats>();
  const [users, setUsers] = useState<UserWithFullName[]>();
  const [appointments, setAppointments] = useState<Appointment[]>();
  const [modalOpen, setModalOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState<Appointment>();

  const appointmentModal = searchParams?.appointment === "true";

  useEffect(() => {
    getDashboardInfo();
  }, []);

  const getDashboardInfo = async () => {
    const stats = await getStats();
    const partialUsers = await getUsers();
    const users = extendArrayOfUsersWithFullName(partialUsers);
    const appointments = await getAppointments();

    stats && setStats(stats);
    users && setAppointments(appointments);
    appointments && setUsers(users);
  };

  const dashboardReady = useMemo(() => {
    return stats && users && appointments;
  }, [stats, users, appointments]);

  return (
    <DashboardLayout linkText={"Esci dalla dashboard"} link={"/"}>
      {dashboardReady ? (
        <>
          {appointmentModal && (
            <AppointmentModal searchParams={searchParams} users={users} />
          )}
          <div className="flex gap-5 lg:gap-3 flex-wrap justify-between md:flex-row mt-5">
            {stats &&
              dashboardCardStats?.map((stat: CardStats) => {
                return (
                  <Card
                    key={stat.id}
                    className="w-[46%] sm:w-[45%] lg:w-[24%] bg-tertiary text-white"
                  >
                    <CardHeader className="px-3 md:px-4">
                      <CardTitle>{stat.title}</CardTitle>
                      <CardDescription className="text-md">
                        {stat.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-3 md:px-5">
                      <h5 className="text-5xl font-bold">
                        {String(stats[stat.id as keyof DashboardStats])}
                      </h5>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
          <UsersTable users={users} />
          <AppointmentModal
            searchParams={searchParams}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            reloadPageData={getDashboardInfo}
            appointmentData={appointmentData}
            setAppointmentData={setAppointmentData}
          />
          <AppointmentManager
            isClientPage={false}
            showButton={false}
            appointments={appointments}
            getPageInfo={getDashboardInfo}
            setModalOpen={setModalOpen}
            setAppointmentData={setAppointmentData}
          />
        </>
      ) : (
        <Spinner size="lg" color="border-white" />
      )}
    </DashboardLayout>
  );
}

export default withAuth(Dashboard);

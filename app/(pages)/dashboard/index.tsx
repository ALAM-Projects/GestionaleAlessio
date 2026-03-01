"use client";

import { withAuth } from "@/app/(hocs)/with-auth";
import { getStats } from "@/app/api/dashboard/getStats";
import { UsersTable } from "@/components/library/users/users.table";
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
import { Appointment, Subscription } from "@prisma/client";
import { getUsers } from "@/app/api/user/getUsers";
import { getAppointments } from "@/app/api/appointments/getAppointments";
import DashboardLayout from "@/app/(layouts)/dashboard";
import { AppointmentModal } from "@/components/library/appointments/appointment-modal";
import { SuperUser } from "@/prisma/user-extension";
import AppointmentManager from "@/components/library/appointments/appointment-manager";
import SubscriptionsManager from "@/components/library/subscriptions/subscriptions-manager";
import { getSubscriptions } from "@/app/api/subscriptions/getSubscriptions";

type DashboardPropsTypes = {
  stats?: DashboardStats;
  users?: SuperUser[];
  appointments?: Appointment[];
  setStats: (stats: DashboardStats) => void;
  setUsers: (users: SuperUser[]) => void;
  setAppointments: (appointments: Appointment[]) => void;
  serverAppointments?: Appointment[];
  // serverSubscriptions: Subscription[];
};

function Dashboard(props: DashboardPropsTypes) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>();
  const [modalOpen, setModalOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState<Appointment>();

  const { stats, users, appointments, setStats, setUsers, setAppointments } =
    props;

  const getDashboardInfo = async () => {
    const stats = await getStats();
    const users = await getUsers();
    const appointments = await getAppointments();
    // const subscriptions = await getSubscriptions();

    stats && setStats(stats);
    appointments && setAppointments(appointments);
    users && setUsers(users);
    // subscriptions && setSubscriptions(subscriptions);
  };

  const dashboardReady = useMemo(() => {
    return stats && users && appointments;
  }, [stats, users, appointments]);

  return (
    <DashboardLayout linkText={"Esci dalla dashboard"} link={"/"}>
      {dashboardReady ? (
        <>
          <AppointmentModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            reloadPageData={getDashboardInfo}
            appointmentData={appointmentData}
            setAppointmentData={setAppointmentData}
            clientId={appointmentData?.userId ?? null}
          />
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

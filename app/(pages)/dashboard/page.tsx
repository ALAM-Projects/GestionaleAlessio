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
import { Appointment, User } from "@prisma/client";
import { getUsers } from "@/app/actions/user/getUsers";
import { getAppointments } from "@/app/actions/appointments/getAppointments";
import DashboardLayout from "@/app/(layouts)/dashboard";
import { useRouter } from "next/navigation";
import AppointmentManager from "@/components/appointment-manager";
import { AppointmentModal } from "@/components/library/appointment-modal";

function Dashboard({ searchParams }: SearchParamProps) {
  const [stats, setStats] = useState<DashboardStats>();
  const [users, setUsers] = useState<User[]>();
  const [appointments, setAppointments] = useState<Appointment[]>();

  const router = useRouter();
  const appointmentModal = searchParams?.appointment === "true";

  useEffect(() => {
    getDashboardStats();
    getAllUsers();
    getAllAppointments();
  }, []);

  const getDashboardStats = async () => {
    const response = await getStats();

    if (response) {
      setStats(response);
    }
  };

  const getAllUsers = async () => {
    const response = await getUsers();

    if (response) {
      setUsers(response);
    }
  };

  const getAllAppointments = async () => {
    const response = await getAppointments();

    if (response) {
      setAppointments(response);
    }
  };

  const dashboardReady = useMemo(() => {
    return stats && users && appointments;
  }, [stats, users, appointments]);

  return (
    <DashboardLayout linkText={"Esci dalla dashboard"} link={"/"}>
      {dashboardReady ? (
        <>
          {appointmentModal && (
            <AppointmentModal
              getClient={getAllAppointments}
              searchParams={searchParams}
              users={users}
            />
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
          <AppointmentManager showButton={false} appointments={appointments} />
        </>
      ) : (
        <Spinner size="lg" color="border-white" />
      )}
    </DashboardLayout>
  );
}

export default withAuth(Dashboard);

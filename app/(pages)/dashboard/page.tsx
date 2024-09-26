"use client";

import { withAuth } from "@/app/(hocs)/with-auth";
import { getStats } from "@/app/actions/dashboard/getStats";
import { UsersTable } from "@/components/library/users.table";
import { AppointmentsTable } from "@/components/library/appointments.table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner";
import { dashboardCardStats } from "@/data/index";
import { Appointment, User } from "@prisma/client";
import { getUsers } from "@/app/actions/user/getUsers";
import Image from "next/image";
import { getAppointments } from "@/app/actions/appointments/getAppointments";

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>();
  const [users, setUsers] = useState<User[]>();
  const [appointments, setAppointments] = useState<Appointment[]>();

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

  if (!stats?.usersCount && !stats?.trainingCount && !stats?.earnings) {
    return (
      <div className="mx-auto p-10">
        <Spinner size="lg" color="border-primary" />;
      </div>
    );
  }

  return (
    <div className="p-10 min-h-screen bg-zinc-800">
      <Image
        src="/red-logo.svg"
        height={100}
        width={100}
        alt="logo"
        className="mx-auto mb-10"
      />
      <div className="flex gap-5 lg:gap-3 flex-wrap justify-between md:flex-row">
        {stats &&
          dashboardCardStats?.map((stat: CardStats) => {
            return (
              <Card
                key={stat.id}
                className="w-[45%] sm:w-[45%] lg:w-[24%] bg-tertiary text-primary"
              >
                <CardHeader>
                  <CardTitle>{stat.title}</CardTitle>
                  <CardDescription>{stat.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h5 className="text-5xl font-bold">
                    {String(stats[stat.id as keyof DashboardStats])}
                  </h5>
                </CardContent>
              </Card>
            );
          })}
      </div>
      {users && <UsersTable users={users} />}
      {appointments && <AppointmentsTable appointments={appointments} />}
    </div>
  );
}

export default withAuth(Dashboard);

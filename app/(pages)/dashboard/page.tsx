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
import { useEffect, useMemo, useState } from "react";
import Spinner from "@/components/ui/spinner";
import { dashboardCardStats } from "@/data/index";
import { Appointment, User } from "@prisma/client";
import { getUsers } from "@/app/actions/user/getUsers";
import Image from "next/image";
import { getAppointments } from "@/app/actions/appointments/getAppointments";
import Link from "next/link";
import DashboardLayout from "@/app/(layouts)/dashboard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>();
  const [users, setUsers] = useState<User[]>();
  const [appointments, setAppointments] = useState<Appointment[]>();

  const router = useRouter();

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
    <DashboardLayout>
      {dashboardReady ? (
        <>
          <div className="flex justify-between items-center">
            <Image
              src="/onboarding-banner.svg"
              height={300}
              width={400}
              alt="logo-banner"
              className="mr-auto mb-5"
            />
          </div>
          <Link href="/" className="text-white underline">
            Esci dalla dashboard
          </Link>
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
                      <CardDescription>{stat.description}</CardDescription>
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
          <AppointmentsTable appointments={appointments} withClient={true} />
        </>
      ) : (
        <Spinner size="lg" color="border-white" />
      )}
    </DashboardLayout>
  );
}

export default withAuth(Dashboard);

"use client";

import { withAuth } from "@/app/(hocs)/with-auth";
import { getStats } from "@/app/actions/dashboard/getStats";
import { DataTableDemo } from "@/components/library/data.table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner";
import dashboardCardStats from "@/data/index";
import { User } from "@prisma/client";
import { getUsers } from "@/app/actions/user/getUsers";

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>();
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    getDashboardStats();
    getAllUsers();
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

  if (!stats?.usersCount && !stats?.trainingCount && !stats?.earnings) {
    return (
      <div className="mx-auto p-10">
        <Spinner size="lg" color="border-primary" />;
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="flex gap-5 flex-wrap justify-between md:flex-row md:justify-center">
        {stats &&
          dashboardCardStats?.map((stat: CardStats) => {
            return (
              <Card
                key={stat.id}
                className="w-[45%] md:w-[25%] bg-tertiary text-primary"
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
      {users && <DataTableDemo users={users} />}
    </div>
  );
}

export default withAuth(Dashboard);

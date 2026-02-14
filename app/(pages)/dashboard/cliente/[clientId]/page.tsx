"use client";

import { getClientStats } from "@/app/api/dashboard/getClientStats";
import { getUserById } from "@/app/api/user/getUserById";
import { SuperUser } from "@/prisma/user-extension";
import ClientPage from ".";
import { getUsersList, GroupUser } from "@/app/api/user/getUsersList";
import { useEffect, useState } from "react";

const Page = ({ params }: { params: { clientId: string } }) => {
  const { clientId } = params;
  const [stats, setStats] = useState<DashboardStats>();
  const [user, setUser] = useState<SuperUser>();
  const [usersList, setUsersList] = useState<GroupUser[]>();

  const fetchStats = async () => {
    const stats = await getClientStats(clientId);
    setStats(stats);
  };
  const fetchUser = async () => {
    const user = await getUserById(clientId);
    user && setUser(user);
  };
  const fetchUsersList = async () => {
    const usersList = await getUsersList();
    setUsersList(usersList);
  };

  useEffect(() => {
    fetchStats();
    fetchUser();
    fetchUsersList();
  }, [clientId]);

  return (
    <ClientPage
      stats={stats}
      user={user as SuperUser}
      usersList={usersList}
      clientId={clientId}
      setStats={setStats}
      setUser={setUser}
      setUsersList={setUsersList}
    />
  );
};

export default Page;

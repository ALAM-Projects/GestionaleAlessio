"use server";

import Dashboard from ".";
import { getStats } from "@/app/api/dashboard/getStats";
import { getUsers } from "@/app/api/user/getUsers";
import { getAppointments } from "@/app/api/appointments/getAppointments";
import { getSubscriptions } from "@/app/api/subscriptions/getSubscriptions";

export const dynamic = "force-dynamic";

const Page = async () => {
  const serverStats = await getStats();
  const serverUsers = await getUsers();
  const serverAppointments = await getAppointments();
  // const serverSubscriptions = await getSubscriptions();

  return (
    <Dashboard
      serverStats={serverStats}
      serverUsers={serverUsers}
      serverAppointments={serverAppointments}
      // serverSubscriptions={serverSubscriptions}
    />
  );
};

export default Page;

"use server";

import Dashboard from ".";
import { getStats } from "@/app/actions/dashboard/getStats";
import { getUsers } from "@/app/actions/user/getUsers";
import { getAppointments } from "@/app/actions/appointments/getAppointments";
import { getSubscriptions } from "@/app/actions/subscriptions/getSubscriptions";

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

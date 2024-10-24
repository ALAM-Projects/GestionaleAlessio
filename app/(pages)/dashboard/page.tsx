"use server";

import Dashboard from ".";
import { getStats } from "@/app/actions/dashboard/getStats";
import { getUsers } from "@/app/actions/user/getUsers";
import { getAppointments } from "@/app/actions/appointments/getAppointments";

const Page = async () => {
  const serverStats = await getStats();
  const serverUsers = await getUsers();
  const serverAppointments = await getAppointments();

  return (
    <Dashboard
      serverStats={serverStats}
      serverUsers={serverUsers}
      serverAppointments={serverAppointments}
    />
  );
};

export default Page;

"use client";

import Dashboard from ".";
import { getStats } from "@/app/api/dashboard/getStats";
import { getUsers } from "@/app/api/user/getUsers";
import { getAppointments } from "@/app/api/appointments/getAppointments";
import { useEffect, useState } from "react";
// import { getSubscriptions } from "@/app/api/subscriptions/getSubscriptions";
import { SuperUser } from "@/prisma/user-extension";
import { Appointment } from "@prisma/client";

const Page = () => {
  const [stats, setStats] = useState<DashboardStats>();
  const [users, setUsers] = useState<SuperUser[]>();
  const [appointments, setAppointments] = useState<Appointment[]>();

  const fetchStats = async () => {
    const stats = await getStats();
    setStats(stats);
  };
  const fetchUsers = async () => {
    const users = await getUsers();
    setUsers(users);
  };
  const fetchAppointments = async () => {
    const appointments = await getAppointments();
    setAppointments(appointments);
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchAppointments();
  }, []);

  // const serverStats = await getStats();
  // const serverUsers = await getUsers();
  // const serverAppointments = await getAppointments();
  // const serverSubscriptions = await getSubscriptions();

  return (
    <Dashboard
      stats={stats}
      users={users}
      appointments={appointments}
      setStats={setStats}
      setUsers={setUsers}
      setAppointments={setAppointments}
      // serverSubscriptions={serverSubscriptions}
    />
  );
};

export default Page;

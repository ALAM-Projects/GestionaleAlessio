"use client";

import { withAuth } from "@/app/(hocs)/with-auth";
import { getStats } from "@/app/api/dashboard/getStats";
import { UsersTable } from "@/components/library/users/users.table";
import { useEffect, useMemo, useState } from "react";
import Spinner from "@/components/ui/spinner";
import { dashboardCardStats } from "@/data/index";
import { Clock, Users, TrendingUp, AlertTriangle, BarChart3, Dumbbell } from "lucide-react";
import { Appointment, Subscription } from "@prisma/client";
import { getUsers } from "@/app/api/user/getUsers";
import { getAppointments } from "@/app/api/appointments/getAppointments";
import DashboardLayout, { NavLinkItem } from "@/app/(layouts)/dashboard";
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

const statsConfig: Record<
  string,
  {
    icon: any;
    iconBg: string;
    iconBorder: string;
    iconColor: string;
    valueColor: string;
    subtitle: string;
  }
> = {
  workedHours: {
    icon: Clock,
    iconBg: "bg-blue-500/10",
    iconBorder: "border-blue-500/20",
    iconColor: "text-blue-400",
    valueColor: "text-white",
    subtitle: "Totale ore lavorate",
  },
  usersCount: {
    icon: Users,
    iconBg: "bg-violet-500/10",
    iconBorder: "border-violet-500/20",
    iconColor: "text-violet-400",
    valueColor: "text-white",
    subtitle: "Clienti registrati",
  },
  earnings: {
    icon: TrendingUp,
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    valueColor: "text-emerald-400",
    subtitle: "Guadagni realizzati",
  },
  unpaid: {
    icon: AlertTriangle,
    iconBg: "bg-amber-500/10",
    iconBorder: "border-amber-500/20",
    iconColor: "text-amber-400",
    valueColor: "text-amber-400",
    subtitle: "Residuo da saldare",
  },
};

const dashboardNavLinks: NavLinkItem[] = [
  { label: "Statistiche", targetId: "statistiche", icon: BarChart3 },
  { label: "Allenamenti", targetId: "allenamenti", icon: Dumbbell },
  { label: "Clienti", targetId: "clienti", icon: Users },
];

function Dashboard(props: DashboardPropsTypes) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>();
  const [modalOpen, setModalOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState<Appointment>();

  const { stats, users, appointments, setStats, setUsers, setAppointments } =
    props;

  const getDashboardInfo = async () => {
    const stats = await getStats();
    const appointments = await getAppointments();
    const users = await getUsers();
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
    <DashboardLayout
      linkText={"Esci dalla dashboard"}
      link={"/"}
      navLinks={dashboardNavLinks}
    >
      {dashboardReady ? (
        <>
          <AppointmentModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            reloadPageData={getDashboardInfo}
            appointmentData={appointmentData}
            setAppointmentData={setAppointmentData}
            clientId={appointmentData?.userId ?? null}
            addUsersSelect={true}
            usersList={users}
          />
          <div
            id="statistiche"
            className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-4"
          >
            {stats &&
              dashboardCardStats?.map((stat: CardStats) => {
                const conf = statsConfig[stat.id] || {
                  icon: TrendingUp,
                  iconBg: "bg-neutral-800",
                  iconBorder: "border-neutral-700",
                  iconColor: "text-neutral-400",
                  valueColor: "text-white",
                  subtitle: stat.description,
                };
                const IconComponent = conf.icon;
                const value = String(stats[stat.id as keyof DashboardStats] ?? 0);

                return (
                  <div
                    key={stat.id}
                    className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 sm:p-6 shadow-xl flex items-center justify-between hover:border-neutral-750 transition-all duration-200 group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        {stat.title}
                      </div>
                      <div
                        className={`text-3xl sm:text-4xl font-bold mt-1.5 tracking-tight ${conf.valueColor}`}
                      >
                        {value}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        {conf.subtitle}
                      </div>
                    </div>
                    <div
                      className={`h-12 w-12 rounded-xl ${conf.iconBg} border ${conf.iconBorder} flex items-center justify-center ${conf.iconColor} shrink-0 transition-transform group-hover:scale-105`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                );
              })}
          </div>
          <div id="allenamenti" className="scroll-mt-24">
            <AppointmentManager
              isClientPage={false}
              showButton={true}
              appointments={appointments}
              getPageInfo={getDashboardInfo}
              setModalOpen={setModalOpen}
              setAppointmentData={setAppointmentData}
            />
          </div>

          <div id="clienti" className="scroll-mt-24">
            <UsersTable users={users} />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center py-20 sm:py-28">
          <Spinner
            size="lg"
            text="Caricamento dashboard"
            subtitle="Sincronizzazione statistiche, allenamenti e clienti in corso..."
          />
        </div>
      )}
    </DashboardLayout>
  );
}

export default withAuth(Dashboard);

"use client";

import DashboardLayout from "@/app/(layouts)/dashboard";
import { getUserById } from "@/app/actions/user/getUserById";
import Spinner from "@/components/ui/spinner";
import { SuperUser } from "@/prisma/user-extension";
import { useEffect, useMemo, useState } from "react";
import { AppointmentModal } from "@/components/library/appointments/appointment-modal";

import { getClientStats } from "@/app/actions/dashboard/getClientStats";
import { clientCardStats } from "@/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppointmentManager from "@/components/library/appointments/appointment-manager";
import { Appointment, Subscription } from "@prisma/client";
import AnamnesiRecap from "@/components/library/users/client-anamnesi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SubscriptionModal } from "@/components/library/users/subscription-modal";
import { Edit } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AppointmentStatus } from "@/types/db_types";
import SubscriptionsManager from "@/components/library/subscriptions/subscriptions-manager";

type ClientPagePropsTypes = {
  serverStats: DashboardStats;
  serverUser: SuperUser;
  clientId: string;
};

const ClientPage = (props: ClientPagePropsTypes) => {
  const [user, setUser] = useState<SuperUser>();
  const [stats, setStats] = useState<DashboardStats>();
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<SuperUser[]>();
  const [appointmentData, setAppointmentData] = useState<Appointment>();
  const [subscriptionData, setSubscriptionData] = useState<Subscription>();

  const { serverStats, serverUser, clientId } = props;

  useEffect(() => {
    // getClientPageInfo();
    serverStats && setStats(serverStats);
    serverUser && setUser(serverUser);
  }, []);

  const getClientPageInfo = async () => {
    const stats = await getClientStats(clientId);
    const user = await getUserById(clientId);

    stats && setStats(stats);
    user && setUser(user);
  };

  const confirmedAppointments = useMemo(() => {
    return user?.appointments?.filter(
      (appointment: Appointment) =>
        appointment.status === AppointmentStatus.Confermato
    );
  }, [user?.appointments]);

  const paidappointmentsIncluded = useMemo(() => {
    return (
      confirmedAppointments?.filter(
        (appointment: Appointment) => appointment.paid
      ).length || 0
    );
  }, [user?.appointments]);

  const allPaid = paidappointmentsIncluded === confirmedAppointments?.length;
  const appointmentsToPay =
    confirmedAppointments &&
    confirmedAppointments?.length - paidappointmentsIncluded;

  const activeSubscription = user?.subscriptions?.find(
    (sub) => sub.completed === false || sub.totalPaid < sub.totalPrice
  );

  console.log("activeSubscription", activeSubscription);

  return (
    <>
      <DashboardLayout linkText={"Torna alla dashboard"} link={"/dashboard"}>
        {user && stats ? (
          <>
            <div className="grid grid-cols-12 items-center mt-5 space-y-12 lg:space-y-0">
              <div className="h-full flex col-span-12 lg:col-span-5 gap-5 lg:gap-3 flex-wrap justify-between md:flex-row">
                {stats &&
                  clientCardStats?.map((stat: CardStats) => {
                    return (
                      <Card
                        key={stat.id}
                        className="w-[46%] lg:w-[98%] xl:w-[48.5%] bg-tertiary text-white"
                      >
                        <CardHeader className="px-3 md:px-4">
                          <CardTitle>{stat.title}</CardTitle>
                          <CardDescription className="text-md">
                            {stat.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="px-3 md:px-5">
                          <h5 className="text-3xl lg:text-5xl font-bold">
                            {String(stats[stat.id as keyof DashboardStats])}
                          </h5>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
              <Card className="flex flex-col items-between lg:flex-row lg:justify-between col-span-12 lg:col-span-7 ml-auto w-[100%] lg:w-[98%] bg-brand/40 text-white  h-full">
                <div className="px-3 md:px-4">
                  <CardHeader className="px-0">
                    {/* <span>CLIENTE:</span> */}
                    <CardTitle className="text-4xl">{user?.fullName}</CardTitle>
                  </CardHeader>
                  <Badge
                    className="text-md"
                    variant={allPaid ? "success" : "destructive"}
                  >
                    {allPaid
                      ? "Pagamenti in regola"
                      : `Da pagare ${appointmentsToPay} appuntamenti`}
                  </Badge>
                </div>
                <CardContent className="px-3 pb-0 pt-6 md:px-4 xl:p-6">
                  <div className="text-xl ">
                    Telefono:{" "}
                    <span className="font-bold">{Number(user?.phone)}</span>
                  </div>
                  <div className="text-xl ">
                    Età: <span className="font-bold">{Number(user?.age)}</span>
                  </div>
                  <div className="text-xl ">
                    Altezza:{" "}
                    <span className="font-bold">{Number(user?.height)} cm</span>
                  </div>
                  <div className="text-xl ">
                    Peso:{" "}
                    <span className="font-bold">{Number(user?.weight)} kg</span>
                  </div>
                  <div className="text-xl ">
                    Sesso: <span className="font-bold">{user?.sex}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {activeSubscription && (
              <Card className="px-3 md:px-4 py-5 mt-10 bg-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">Abbonamento attivo</div>
                    <Edit
                      className="cursor-pointer ms-2"
                      onClick={() => {
                        setSubscriptionData(activeSubscription);
                        setSubscriptionModalOpen(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center">
                    <div className="text-xl font-bold">
                      Pagati €{activeSubscription?.totalPaid} su €
                      {activeSubscription?.totalPrice}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-1.5 mt-5">
                  <span>{activeSubscription?.doneAppointments}</span>
                  <Progress
                    className=""
                    max={activeSubscription?.appointmentsIncluded}
                    value={activeSubscription?.doneAppointments}
                  />
                  <span>{activeSubscription?.appointmentsIncluded}</span>
                </div>
              </Card>
            )}

            {/* ANAMNESI */}
            <Accordion type="single" className="mt-10" collapsible>
              <AccordionItem value="anamnesi">
                <AccordionTrigger>
                  <h3 className="inline text-3xl lg:text-4xl font-bold text-white">
                    Scheda di anamnesi
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <AnamnesiRecap user={user} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* ANAMNESI */}

            <AppointmentManager
              appointments={user.appointments}
              clientId={clientId}
              withClient={false}
              getPageInfo={getClientPageInfo}
              setAppointmentModalOpen={setAppointmentModalOpen}
              setSubscriptionModalOpen={setSubscriptionModalOpen}
              setAppointmentData={setAppointmentData}
              showSubscriptionButton={!user.hasActiveSubscription}
            />

            <SubscriptionsManager
              subscriptions={user.subscriptions}
              clientId={clientId}
              withClient={false}
              getPageInfo={getClientPageInfo}
              setAppointmentModalOpen={setAppointmentModalOpen}
              setSubscriptionModalOpen={setSubscriptionModalOpen}
              setAppointmentData={setAppointmentData}
            />
          </>
        ) : (
          <Spinner size="lg" color="border-white" />
        )}
      </DashboardLayout>

      {/* MODALS */}
      <AppointmentModal
        clientId={clientId}
        modalOpen={appointmentModalOpen}
        setModalOpen={setAppointmentModalOpen}
        allUsers={allUsers}
        reloadPageData={getClientPageInfo}
        appointmentData={appointmentData}
        setAppointmentData={setAppointmentData}
        hasAvailableSubscriptionTrainings={
          user?.hasAvailableSubscriptionTrainings
        }
      />
      <SubscriptionModal
        clientId={clientId}
        modalOpen={subscriptionModalOpen}
        setModalOpen={setSubscriptionModalOpen}
        allUsers={allUsers}
        reloadPageData={getClientPageInfo}
        subscriptionData={subscriptionData}
        setSubscriptionData={setSubscriptionData}
      />
    </>
  );
};

export default ClientPage;

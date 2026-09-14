"use client";

import DashboardLayout, { NavLinkItem } from "@/app/(layouts)/dashboard";
import { getUserById } from "@/app/api/user/getUserById";
import Spinner from "@/components/ui/spinner";
import { SuperUser } from "@/prisma/user-extension";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppointmentModal } from "@/components/library/appointments/appointment-modal";

import { getClientStats } from "@/app/api/dashboard/getClientStats";
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
import {
  Edit,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Dumbbell,
  ChevronRight,
  FileText,
  TrendingUp,
  Phone,
  User as UserIcon,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AppointmentStatus } from "@/types/db_types";
import SubscriptionsManager from "@/components/library/subscriptions/subscriptions-manager";
import { getUsersList, GroupUser } from "@/app/api/user/getUsersList";
import { payInstallment } from "@/app/api/subscriptions/payInstallment";
import {
  formatDateIT,
  getSubscriptionPaymentAlert,
  parseInstallments,
  getTodayDateString,
} from "@/lib/subscription-helpers";

type ClientPagePropsTypes = {
  stats?: DashboardStats;
  user?: SuperUser;
  usersList?: GroupUser[];
  setStats: (stats: DashboardStats) => void;
  setUser: (user: SuperUser) => void;
  setUsersList: (usersList: GroupUser[]) => void;
  clientId: string;
};

const ClientPage = (props: ClientPagePropsTypes) => {
  const router = useRouter();
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<SuperUser[]>();
  const [appointmentData, setAppointmentData] = useState<Appointment>();
  const [subscriptionData, setSubscriptionData] = useState<Subscription>();

  const { clientId, stats, user, usersList, setStats, setUser, setUsersList } =
    props;

  const getClientPageInfo = async () => {
    const stats = await getClientStats(clientId);
    const user = await getUserById(clientId);

    stats && setStats(stats);
    user && setUser(user);
  };

  const confirmedAppointments = useMemo(() => {
    return user?.appointments?.filter(
      (appointment: Appointment) =>
        appointment.status === AppointmentStatus.Confermato,
    );
  }, [user?.appointments]);

  const paidAppointmentsIncluded = useMemo(() => {
    return (
      confirmedAppointments?.filter(
        (appointment: Appointment) => appointment.paid,
      ).length || 0
    );
  }, [user?.appointments]);

  const allPaid = paidAppointmentsIncluded === confirmedAppointments?.length;
  const appointmentsToPay =
    confirmedAppointments &&
    confirmedAppointments?.length - paidAppointmentsIncluded;

  const activeSubscription = user?.subscriptions?.find(
    (sub) => sub.completed === false,
  );

  const lastSubscription = useMemo(() => {
    if (!user?.subscriptions?.length) return undefined;
    return user.subscriptions.reduce((latest, sub) =>
      sub.id > latest.id ? sub : latest,
    );
  }, [user?.subscriptions]);

  const { canCreateSubscription, subscriptionBlockReason } = useMemo(() => {
    if (!lastSubscription) {
      return { canCreateSubscription: true, subscriptionBlockReason: "" };
    }
    const appointmentsDone =
      lastSubscription.doneAppointments >= lastSubscription.appointmentsIncluded;
    const fullyPaid = lastSubscription.totalPaid >= lastSubscription.totalPrice;

    if (appointmentsDone && fullyPaid) {
      return { canCreateSubscription: true, subscriptionBlockReason: "" };
    }

    const reasons: string[] = [];
    if (!appointmentsDone) reasons.push("completato a livello di appuntamenti");
    if (!fullyPaid) reasons.push("pagato per intero");

    return {
      canCreateSubscription: false,
      subscriptionBlockReason: `L'ultimo abbonamento non è ${reasons.join(" e ")}`,
    };
  }, [lastSubscription]);

  const navLinks: NavLinkItem[] = useMemo(() => {
    const links: NavLinkItem[] = [
      { label: "Profilo", targetId: "profilo", icon: UserIcon },
    ];
    if (activeSubscription) {
      links.push({
        label: "Abbonamento attivo",
        targetId: "abbonamento-attivo",
        icon: CreditCard,
      });
    }
    links.push(
      { label: "Anamnesi", targetId: "anamnesi", icon: FileText },
      { label: "Abbonamenti", targetId: "abbonamenti", icon: Layers },
      { label: "Allenamenti", targetId: "allenamenti", icon: Dumbbell },
    );
    return links;
  }, [activeSubscription]);

  return (
    <>
      <DashboardLayout
        linkText={"Torna alla dashboard"}
        link={"/dashboard"}
        navLinks={navLinks}
      >
        {user && stats ? (
          <>
            {/* HERO SECTION: CLIENT PROFILE & STATS */}
            <div
              id="profilo"
              className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4"
            >
              {/* CLIENT PROFILE CARD (8 COLS) */}
              <div className="lg:col-span-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-hidden p-6 flex flex-col justify-between gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* AVATAR WITH INITIALS */}
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-neutral-800 to-neutral-750 border border-neutral-700 flex items-center justify-center text-white text-2xl font-bold shadow-inner shrink-0">
                      {user.name?.[0]}{user.surname?.[0]}
                    </div>
                    <div>
                      <div className="flex items-center flex-wrap gap-3">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          {user.fullName}
                        </h1>
                        <Badge
                          variant={allPaid ? "success" : "destructive"}
                          className="text-xs px-2.5 py-0.5"
                        >
                          {allPaid
                            ? "Pagamenti in regola"
                            : `Da pagare ${appointmentsToPay} appuntamenti`}
                        </Badge>
                      </div>
                      {user.goal && (
                        <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                          <span>Obiettivo:</span>
                          <span className="text-neutral-200 font-medium">{user.goal}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* BIOMETRIC & CONTACT PILLS */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-neutral-800">
                  <div className="p-3 rounded-xl bg-neutral-850/60 border border-neutral-800 flex flex-col justify-center">
                    <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-neutral-400" />
                      <span>Telefono</span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-1 truncate">
                      {Number(user.phone)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-850/60 border border-neutral-800 flex flex-col justify-center">
                    <div className="text-[11px] text-neutral-400">Età</div>
                    <div className="text-sm font-semibold text-white mt-1">
                      {Number(user.age)} anni
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-850/60 border border-neutral-800 flex flex-col justify-center">
                    <div className="text-[11px] text-neutral-400">Altezza</div>
                    <div className="text-sm font-semibold text-white mt-1">
                      {Number(user.height)} cm
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-850/60 border border-neutral-800 flex flex-col justify-center">
                    <div className="text-[11px] text-neutral-400">Peso</div>
                    <div className="text-sm font-semibold text-white mt-1">
                      {Number(user.weight)} kg
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-850/60 border border-neutral-800 col-span-2 sm:col-span-1 flex flex-col justify-center">
                    <div className="text-[11px] text-neutral-400">Sesso</div>
                    <div className="text-sm font-semibold text-white mt-1 capitalize">
                      {user.sex || "-"}
                    </div>
                  </div>
                </div>
              </div>

              {/* KPI STATS CARDS (4 COLS) */}
              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {/* ALLENAMENTI */}
                <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 shadow-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Allenamenti
                    </div>
                    <div className="text-3xl font-bold text-white mt-1">
                      {String(stats?.trainingCount ?? 0)}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Effettuati fino ad oggi
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Dumbbell className="h-6 w-6" />
                  </div>
                </div>

                {/* GUADAGNI */}
                <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 shadow-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Guadagni
                    </div>
                    <div className="text-3xl font-bold text-emerald-400 mt-1">
                      {String(stats?.earnings ?? "€0")}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Totale incassato dal cliente
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>

            {activeSubscription && (() => {
              const alert = getSubscriptionPaymentAlert(activeSubscription);
              const installments = parseInstallments((activeSubscription as any).installments);

              return (
                <div
                  id="abbonamento-attivo"
                  className="scroll-mt-24 mt-10 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-hidden"
                >
                  {/* TOP HEADER */}
                  <div className="p-5 sm:p-6 bg-gradient-to-r from-neutral-850 via-neutral-900 to-neutral-850 border-b border-neutral-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-white tracking-tight">
                            Abbonamento attivo #{activeSubscription.id}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Attivo
                          </span>
                        </div>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400 mt-1">
                          {activeSubscription.advancePaymentDate && (
                            <span>Iniziato il {formatDateIT(activeSubscription.advancePaymentDate)}</span>
                          )}
                          {(activeSubscription as any).expirationDate && (
                            <span className="flex items-center gap-1.5 text-neutral-300">
                              <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                              Scadenza: <strong className="text-white">{formatDateIT((activeSubscription as any).expirationDate)}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-auto">
                      <div className="text-right">
                        <div className="text-xs text-neutral-400">Incassato</div>
                        <div className="text-lg font-bold">
                          <span className="text-emerald-400">€{activeSubscription.totalPaid}</span>
                          <span className="text-neutral-500 text-sm"> / €{activeSubscription.totalPrice}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          router.push(
                            `/dashboard/cliente/${clientId}/abbonamento?subscriptionId=${activeSubscription.id}`,
                          );
                        }}
                        className="h-9 px-3 text-xs bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border-neutral-700 flex items-center gap-1.5"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Modifica</span>
                      </Button>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-5 sm:p-6 space-y-5">
                    {/* ALERT SALDO (SE PRESENTE) */}
                    {alert && (
                      <div className="rounded-xl p-4 bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-5 w-5 text-amber-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-amber-200">
                              {alert.message}
                            </div>
                            {alert.pendingInstallment && (
                              <div className="text-xs text-amber-300/80 mt-0.5">
                                {alert.isUrgent
                                  ? `Rata scaduta il ${formatDateIT(alert.pendingInstallment.dueDate)}`
                                  : `Scadenza prevista entro il ${formatDateIT(alert.pendingInstallment.dueDate)}`}
                              </div>
                            )}
                          </div>
                        </div>
                        {alert.pendingInstallment && (
                          <Button
                            size="sm"
                            onClick={async () => {
                              const ok = await payInstallment(
                                activeSubscription.id,
                                alert.pendingInstallment!.installmentNumber,
                              );
                              if (ok) getClientPageInfo();
                            }}
                            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs h-8 px-3 shrink-0"
                          >
                            Segna rata saldata (€{alert.pendingInstallment.amount})
                          </Button>
                        )}
                      </div>
                    )}

                    {/* RATE BREAKDOWN */}
                    {installments.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                          <span>Piano Rate</span>
                          <span className="text-neutral-300 font-normal">
                            {installments.filter((i) => i.paid).length} di {installments.length} saldate
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {installments.map((inst) => {
                            const today = getTodayDateString();
                            const isOverdue = !inst.paid && today > inst.dueDate;

                            return (
                              <div
                                key={inst.installmentNumber}
                                className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition-all ${
                                  inst.paid
                                    ? "bg-emerald-950/20 border-emerald-500/25"
                                    : isOverdue
                                      ? "bg-red-950/20 border-red-500/30"
                                      : "bg-neutral-850/60 border-neutral-700/60"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-neutral-300">
                                    Rata {inst.installmentNumber}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      inst.paid
                                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                        : isOverdue
                                          ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                    }`}
                                  >
                                    {inst.paid ? "Pagata" : isOverdue ? "Scaduta" : "Da saldare"}
                                  </span>
                                </div>

                                <div>
                                  <div className="text-lg font-bold text-white">€{inst.amount}</div>
                                  <div className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                                    {inst.paid ? (
                                      <>
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                        <span>Saldata ({formatDateIT(inst.paidDate || inst.dueDate)})</span>
                                      </>
                                    ) : (
                                      <>
                                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                                        <span>Scadenza: {formatDateIT(inst.dueDate)}</span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {!inst.paid && (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      const ok = await payInstallment(
                                        activeSubscription.id,
                                        inst.installmentNumber,
                                      );
                                      if (ok) getClientPageInfo();
                                    }}
                                    className="mt-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center justify-between pt-2 border-t border-neutral-800"
                                  >
                                    <span>Segna come saldata</span>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ALLENAMENTI PROGRESS */}
                    <div className="p-4 rounded-xl bg-neutral-850/50 border border-neutral-800 space-y-2.5">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <div className="flex items-center gap-2 text-white">
                          <Dumbbell className="h-4 w-4 text-emerald-400" />
                          <span>Avanzamento Allenamenti</span>
                        </div>
                        <div className="text-neutral-300 text-xs">
                          <strong className="text-white text-sm">{activeSubscription.doneAppointments}</strong> su {activeSubscription.appointmentsIncluded} completati
                          <span className="text-neutral-500 ml-2">
                            ({activeSubscription.appointmentsIncluded - activeSubscription.doneAppointments} rimanenti)
                          </span>
                        </div>
                      </div>
                      <Progress
                        className="h-2.5 bg-neutral-800"
                        max={activeSubscription.appointmentsIncluded}
                        value={activeSubscription.doneAppointments}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ANAMNESI */}
            <div
              id="anamnesi"
              className="scroll-mt-24 mt-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-hidden"
            >
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="anamnesi" className="border-none">
                  <AccordionTrigger className="p-5 sm:p-6 bg-gradient-to-r from-neutral-850 via-neutral-900 to-neutral-850 hover:bg-neutral-850/80 transition-colors text-left no-underline hover:no-underline [&>svg]:text-neutral-400">
                    <div className="flex items-center gap-3.5">
                      <div className="h-11 w-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-xl font-bold text-white tracking-tight">
                            Scheda di anamnesi
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                            Profilo clinico
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Abitudini sportive, obiettivi, problematiche articolari e infortuni
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-5 sm:p-6 pt-4 border-t border-neutral-800">
                    <AnamnesiRecap user={user} userId={clientId} onSave={getClientPageInfo} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            {/* ANAMNESI */}

            <div id="abbonamenti" className="scroll-mt-24">
              <SubscriptionsManager
                subscriptions={user.subscriptions}
                clientId={clientId}
                withClient={false}
                getPageInfo={getClientPageInfo}
                setAppointmentModalOpen={setAppointmentModalOpen}
                setSubscriptionModalOpen={setSubscriptionModalOpen}
                setAppointmentData={setAppointmentData}
                setSubscriptionData={setSubscriptionData}
                canCreateSubscription={canCreateSubscription}
                subscriptionBlockReason={subscriptionBlockReason}
              />
            </div>

            <div id="allenamenti" className="scroll-mt-24">
              <AppointmentManager
                appointments={user.appointments}
                subscriptions={user.subscriptions}
                clientId={clientId}
                withClient={false}
                getPageInfo={getClientPageInfo}
                setAppointmentModalOpen={setAppointmentModalOpen}
                setSubscriptionModalOpen={setSubscriptionModalOpen}
                setAppointmentData={setAppointmentData}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-20 sm:py-28">
            <Spinner
              size="lg"
              text="Caricamento cliente"
              subtitle="Recupero scheda, abbonamenti e storico allenamenti in corso..."
            />
          </div>
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
        usersList={usersList}
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

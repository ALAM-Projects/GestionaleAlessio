"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppointmentsTable } from "./appointments.table";
import AppointmentsCalendar from "./appointments.calendar";
import { useRouter } from "next/navigation";
import { Dumbbell, Plus, LayoutList, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const AppointmentManager = ({ ...props }) => {
  const router = useRouter();
  const {
    appointments,
    subscriptions,
    clientId,
    isClientPage = true,
    showButton = true,
    showSubscriptionButton,
    canCreateSubscription = true,
    subscriptionBlockReason = "",
    getPageInfo,
    setAppointmentModalOpen,
    setModalOpen,
    setSubscriptionModalOpen,
    setAppointmentData,
  } = props;

  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

  // Restore saved view preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("appointments_view_mode");
      if (saved === "table" || saved === "calendar") {
        setViewMode(saved);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  const handleSetViewMode = (mode: "table" | "calendar") => {
    setViewMode(mode);
    try {
      localStorage.setItem("appointments_view_mode", mode);
    } catch (e) {
      // Ignore
    }
  };

  const openAppointmentModal = setAppointmentModalOpen ?? setModalOpen;

  return (
    <div className="mt-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-hidden">
      {/* HEADER BAR */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-neutral-850 via-neutral-900 to-neutral-850 border-b border-neutral-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Allenamenti
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                {appointments?.length ?? 0}{" "}
                {appointments?.length === 1 ? "appuntamento" : "appuntamenti"}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isClientPage
                ? "Storico e pianificazione delle sedute di allenamento del cliente"
                : "Storico e gestione degli appuntamenti"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* VIEW SWITCHER TOGGLE: TABELLA / CALENDARIO */}
          <div className="flex items-center p-1 rounded-xl bg-neutral-950/60 border border-neutral-800">
            <button
              type="button"
              onClick={() => handleSetViewMode("table")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
                viewMode === "table"
                  ? "bg-neutral-800 text-white shadow-sm border border-neutral-700"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              <LayoutList className="h-3.5 w-3.5" />
              <span>Tabella</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetViewMode("calendar")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
                viewMode === "calendar"
                  ? "bg-neutral-800 text-white shadow-sm border border-neutral-700"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Calendario</span>
            </button>
          </div>

          {showButton && (
            <Button
              variant="brand"
              size="sm"
              onClick={() => openAppointmentModal(true)}
              className="h-9 px-4 text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand/20 shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nuovo appuntamento</span>
            </Button>
          )}
        </div>
      </div>

      {/* CONTENT: TABLE OR CALENDAR */}
      {viewMode === "table" ? (
        <AppointmentsTable
          appointments={appointments}
          clientSubscriptions={subscriptions}
          isClientPage={isClientPage}
          setModalOpen={openAppointmentModal}
          clientId={clientId}
          getPageInfo={() => getPageInfo()}
          setAppointmentData={setAppointmentData}
        />
      ) : (
        <AppointmentsCalendar
          appointments={appointments}
          clientSubscriptions={subscriptions}
          isClientPage={isClientPage}
          setModalOpen={openAppointmentModal}
          clientId={clientId}
          getPageInfo={() => getPageInfo()}
          setAppointmentData={setAppointmentData}
        />
      )}
    </div>
  );
};

export default AppointmentManager;

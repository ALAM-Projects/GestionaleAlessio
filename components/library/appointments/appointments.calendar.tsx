"use client";

import React, { useMemo, useState } from "react";
import { Appointment, Subscription } from "@prisma/client";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  AlertTriangle,
  User as UserIcon,
  CheckCircle2,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AppointmentsCalendarProps {
  appointments?: Appointment[];
  clientSubscriptions?: Subscription[];
  isClientPage?: boolean;
  setModalOpen: (open: boolean) => void;
  clientId?: string | null;
  getPageInfo: () => void;
  setAppointmentData: (data: any) => void;
}

type CalendarView = "week" | "month" | "day";

const DAYS_IT = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica",
];

const MONTHS_IT = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

// Helper functions for date operations
function toDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, days: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

const START_HOUR = 7;
const END_HOUR = 22; // up to 22:00

interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
  key: string;
  isHalfHour: boolean;
}

const SLOTS: TimeSlot[] = [];
for (let h = START_HOUR; h <= END_HOUR; h++) {
  SLOTS.push({
    hour: h,
    minute: 0,
    label: `${String(h).padStart(2, "0")}:00`,
    key: `${String(h).padStart(2, "0")}:00`,
    isHalfHour: false,
  });
  if (h < END_HOUR) {
    SLOTS.push({
      hour: h,
      minute: 30,
      label: `${String(h).padStart(2, "0")}:30`,
      key: `${String(h).padStart(2, "0")}:30`,
      isHalfHour: true,
    });
  }
}

function getAppointmentSlotKey(timeStr: string | null | undefined): string | null {
  if (!timeStr) return null;
  const parts = timeStr.trim().split(":");
  if (parts.length < 2) return null;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return null;
  const slotMinute = m < 30 ? 0 : 30;
  return `${String(h).padStart(2, "0")}:${String(slotMinute).padStart(2, "0")}`;
}

export const AppointmentsCalendar: React.FC<AppointmentsCalendarProps> = ({
  appointments = [],
  clientSubscriptions = [],
  isClientPage = false,
  setModalOpen,
  clientId,
  getPageInfo,
  setAppointmentData,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [view, setView] = useState<CalendarView>("week");

  const todayStr = useMemo(() => toDateString(new Date()), []);

  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const appt of appointments) {
      if (!appt.date) continue;
      const list = map.get(appt.date) || [];
      list.push(appt);
      map.set(appt.date, list);
    }
    // Sort each day's appointments by time
    map.forEach((list) => {
      list.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
    });
    return map;
  }, [appointments]);

  // Navigation handlers
  const handlePrev = () => {
    setCurrentDate((prev) => {
      if (view === "week") return addDays(prev, -7);
      if (view === "month") {
        const d = new Date(prev);
        d.setMonth(d.getMonth() - 1);
        return d;
      }
      return addDays(prev, -1);
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      if (view === "week") return addDays(prev, 7);
      if (view === "month") {
        const d = new Date(prev);
        d.setMonth(d.getMonth() + 1);
        return d;
      }
      return addDays(prev, 1);
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Click on slot to create new appointment
  const handleSlotClick = (dateStr: string, hour: number, minute: number = 0) => {
    const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    setAppointmentData({
      date: dateStr,
      time: timeStr,
      userId: clientId || undefined,
    });
    setModalOpen(true);
  };

  // Click on existing appointment to edit
  const handleAppointmentClick = (
    e: React.MouseEvent,
    appointment: Appointment
  ) => {
    e.stopPropagation();
    setAppointmentData(appointment);
    setModalOpen(true);
  };

  // Week days calculation
  const weekDays = useMemo(() => {
    const monday = getMonday(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(monday, i);
      return {
        date: d,
        dateStr: toDateString(d),
        dayName: DAYS_IT[i],
        dayNumber: d.getDate(),
        isToday: toDateString(d) === todayStr,
      };
    });
  }, [currentDate, todayStr]);

  // Month days calculation
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstMonday = getMonday(firstDayOfMonth);
    const totalDays: Array<{
      date: Date;
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }> = [];

    let cur = new Date(firstMonday);
    // Render until we reach at least the end of the last week of the month (minimum 35 or 42 cells)
    while (
      cur <= lastDayOfMonth ||
      cur.getDay() !== 1 ||
      totalDays.length % 7 !== 0
    ) {
      const isCurrentMonth = cur.getMonth() === month;
      const dateStr = toDateString(cur);
      totalDays.push({
        date: new Date(cur),
        dateStr,
        dayNumber: cur.getDate(),
        isCurrentMonth,
        isToday: dateStr === todayStr,
      });
      cur = addDays(cur, 1);
      if (totalDays.length >= 42) break;
    }

    return totalDays;
  }, [currentDate, todayStr]);

  // Current period label
  const periodLabel = useMemo(() => {
    if (view === "month") {
      return `${MONTHS_IT[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    if (view === "week") {
      const start = weekDays[0].date;
      const end = weekDays[6].date;
      if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()} – ${end.getDate()} ${MONTHS_IT[start.getMonth()]} ${start.getFullYear()}`;
      }
      return `${start.getDate()} ${MONTHS_IT[start.getMonth()]} – ${end.getDate()} ${MONTHS_IT[end.getMonth()]} ${end.getFullYear()}`;
    }
    // Day view
    const dayOfWeek = DAYS_IT[(currentDate.getDay() + 6) % 7];
    return `${dayOfWeek} ${currentDate.getDate()} ${MONTHS_IT[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }, [view, currentDate, weekDays]);

  // Helper to format appointment badge colors
  const getAppointmentBadgeStyles = (appt: Appointment) => {
    const isCompleted = appt.status === "completato";
    const isPaid = appt.paid || appt.paidBySubscription;

    if (appt.paidBySubscription) {
      return {
        bg: "bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/40 text-blue-200",
        indicator: "bg-blue-400",
        label: "Abbonamento",
      };
    }
    if (isPaid) {
      return {
        bg: "bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/40 text-emerald-200",
        indicator: "bg-emerald-400",
        label: `€${appt.price}`,
      };
    }
    // Unpaid
    return {
      bg: "bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-200",
      indicator: "bg-amber-400",
      label: `Da pagare €${appt.price}`,
    };
  };

  return (
    <div className="w-full flex flex-col bg-neutral-900 select-none">
      {/* CALENDAR TOOLBAR */}
      <div className="p-4 sm:p-5 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 bg-neutral-850/40">
        {/* LEFT: TODAY & NAV BUTTONS & PERIOD LABEL */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="h-8 px-3 text-xs font-semibold bg-neutral-800 hover:bg-neutral-750 border-neutral-700 text-neutral-200 hover:text-white rounded-lg transition-colors"
          >
            Oggi
          </Button>

          <div className="flex items-center rounded-lg bg-neutral-800 border border-neutral-700 overflow-hidden">
            <button
              type="button"
              onClick={handlePrev}
              className="h-8 w-8 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-750 transition-colors"
              title="Precedente"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-neutral-700" />
            <button
              type="button"
              onClick={handleNext}
              className="h-8 w-8 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-750 transition-colors"
              title="Successivo"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <h4 className="text-base sm:text-lg font-bold text-white tracking-tight ml-1">
            {periodLabel}
          </h4>
        </div>

        {/* RIGHT: VIEW SELECTOR (DAY / WEEK / MONTH) */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-950/60 border border-neutral-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setView("day")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
              view === "day"
                ? "bg-neutral-800 text-white shadow-sm border border-neutral-700"
                : "text-neutral-400 hover:text-neutral-200"
            )}
          >
            <span>Giorno</span>
          </button>
          <button
            type="button"
            onClick={() => setView("week")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
              view === "week"
                ? "bg-neutral-800 text-white shadow-sm border border-neutral-700"
                : "text-neutral-400 hover:text-neutral-200"
            )}
          >
            <span>Settimana</span>
          </button>
          <button
            type="button"
            onClick={() => setView("month")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
              view === "month"
                ? "bg-neutral-800 text-white shadow-sm border border-neutral-700"
                : "text-neutral-400 hover:text-neutral-200"
            )}
          >
            <span>Mese</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* VISTA SETTIMANA (WEEK VIEW)                                  */}
      {/* ============================================================ */}
      {view === "week" && (
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            {/* WEEK HEADER (DAYS) */}
            <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-neutral-800 bg-neutral-900 sticky top-0 z-10">
              <div className="p-3 text-[11px] font-semibold text-neutral-500 uppercase text-center border-r border-neutral-800">
                Ora
              </div>
              {weekDays.map((day) => (
                <div
                  key={day.dateStr}
                  className={cn(
                    "p-2.5 sm:p-3 text-center border-r border-neutral-800 last:border-r-0 transition-colors",
                    day.isToday && "bg-blue-500/5"
                  )}
                >
                  <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                    {day.dayName.slice(0, 3)}
                  </div>
                  <div className="mt-1 flex items-center justify-center">
                    <span
                      className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                        day.isToday
                          ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                          : "text-white"
                      )}
                    >
                      {day.dayNumber}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* WEEK TIME GRID */}
            <div className="relative bg-neutral-900">
              {SLOTS.map((slot) => {
                return (
                  <div
                    key={slot.key}
                    className={cn(
                      "grid grid-cols-[64px_repeat(7,1fr)] min-h-[46px]",
                      slot.isHalfHour
                        ? "border-t border-dashed border-neutral-800/40"
                        : "border-t border-neutral-800/90"
                    )}
                  >
                    {/* TIME LABEL */}
                    <div className="p-1 text-right pr-2.5 font-mono border-r border-neutral-800 flex items-start justify-end">
                      <span
                        className={cn(
                          slot.isHalfHour
                            ? "text-[10px] text-neutral-500 font-normal -mt-1.5"
                            : "text-xs font-semibold text-neutral-300 -mt-2"
                        )}
                      >
                        {slot.label}
                      </span>
                    </div>

                    {/* DAY SLOTS */}
                    {weekDays.map((day) => {
                      const dayAppts = appointmentsByDate.get(day.dateStr) || [];
                      // Match appointments whose 30-min slot corresponds to this slot
                      const slotAppts = dayAppts.filter((a) => {
                        return getAppointmentSlotKey(a.time) === slot.key;
                      });

                      return (
                        <div
                          key={`${day.dateStr}-${slot.key}`}
                          onClick={() =>
                            handleSlotClick(day.dateStr, slot.hour, slot.minute)
                          }
                          className={cn(
                            "relative border-r border-neutral-800/80 last:border-r-0 p-1 hover:bg-neutral-800/30 cursor-pointer transition-colors group",
                            day.isToday && "bg-blue-500/[0.02]"
                          )}
                        >
                          {/* QUICK PLUS ON HOVER IF EMPTY */}
                          {slotAppts.length === 0 && (
                            <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity">
                              <span className="h-5 w-5 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 text-[10px] shadow-sm">
                                <Plus className="h-2.5 w-2.5" />
                              </span>
                            </div>
                          )}

                          {/* APPOINTMENT CARDS */}
                          <div className="flex flex-col gap-1 w-full">
                            {slotAppts.map((appt) => {
                              const style = getAppointmentBadgeStyles(appt);
                              const client = (appt as any).user;
                              const clientName = client
                                ? `${client.name} ${client.surname}`
                                : "Cliente";

                              return (
                                <div
                                  key={appt.id}
                                  onClick={(e) =>
                                    handleAppointmentClick(e, appt)
                                  }
                                  className={cn(
                                    "p-1.5 rounded-lg border text-left shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-95 group/item",
                                    style.bg
                                  )}
                                >
                                  <div className="flex items-center justify-between gap-1 text-[11px] font-semibold leading-tight">
                                    <span className="flex items-center gap-1 truncate font-bold">
                                      <span
                                        className={cn(
                                          "h-1.5 w-1.5 rounded-full shrink-0",
                                          style.indicator
                                        )}
                                      />
                                      <span className="truncate">
                                        {isClientPage ? "Allenamento" : clientName}
                                      </span>
                                    </span>
                                    <span className="text-[10px] opacity-80 shrink-0 font-mono">
                                      {appt.time}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between gap-1 mt-0.5 text-[10px] opacity-90">
                                    <span className="truncate">
                                      {appt.paidBySubscription
                                        ? `Sub #${appt.subscriptionId}`
                                        : appt.paid
                                        ? "Saldato"
                                        : "Da saldare"}
                                    </span>
                                    {!appt.paid && !appt.paidBySubscription && (
                                      <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VISTA MESE (MONTH VIEW)                                      */}
      {/* ============================================================ */}
      {view === "month" && (
        <div className="w-full">
          {/* DAY NAMES HEADER */}
          <div className="grid grid-cols-7 border-b border-neutral-800 bg-neutral-900 text-center">
            {DAYS_IT.map((name) => (
              <div
                key={name}
                className="py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider border-r border-neutral-800 last:border-r-0"
              >
                {name.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* MONTH GRID */}
          <div className="grid grid-cols-7 divide-x divide-y divide-neutral-800 bg-neutral-900 border-b border-neutral-800">
            {monthDays.map((day) => {
              const dayAppts = appointmentsByDate.get(day.dateStr) || [];
              const maxVisible = 3;
              const overflowCount = dayAppts.length - maxVisible;

              return (
                <div
                  key={day.dateStr}
                  onClick={() => handleSlotClick(day.dateStr, 10)}
                  className={cn(
                    "min-h-[110px] sm:min-h-[125px] p-1.5 sm:p-2 flex flex-col justify-between hover:bg-neutral-850/40 cursor-pointer transition-colors group relative",
                    !day.isCurrentMonth && "opacity-35 bg-neutral-950/20",
                    day.isToday && "bg-blue-500/[0.03]"
                  )}
                >
                  {/* CELL TOP: DAY NUMBER & ADD ICON */}
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center",
                        day.isToday
                          ? "bg-blue-500 text-white shadow-sm shadow-blue-500/30"
                          : "text-neutral-300 group-hover:text-white"
                      )}
                    >
                      {day.dayNumber}
                    </span>

                    <span className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-white transition-opacity">
                      <Plus className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  {/* EVENTS LIST IN CELL */}
                  <div className="flex flex-col gap-1 mt-1 flex-1 overflow-hidden">
                    {dayAppts.slice(0, maxVisible).map((appt) => {
                      const style = getAppointmentBadgeStyles(appt);
                      const client = (appt as any).user;
                      const clientName = client
                        ? `${client.name} ${client.surname}`
                        : "Cliente";

                      return (
                        <div
                          key={appt.id}
                          onClick={(e) => handleAppointmentClick(e, appt)}
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-medium border flex items-center justify-between gap-1 truncate transition-all hover:scale-[1.02]",
                            style.bg
                          )}
                          title={`${appt.time} - ${clientName} (${style.label})`}
                        >
                          <span className="truncate flex items-center gap-1 font-semibold">
                            <span
                              className={cn(
                                "h-1 w-1 rounded-full shrink-0",
                                style.indicator
                              )}
                            />
                            <span>{appt.time}</span>
                            <span className="truncate font-normal">
                              {isClientPage ? "Allenamento" : clientName}
                            </span>
                          </span>
                        </div>
                      );
                    })}

                    {overflowCount > 0 && (
                      <div className="text-[10px] text-neutral-400 font-semibold px-1">
                        +{overflowCount} altri
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VISTA GIORNO (DAY VIEW)                                      */}
      {/* ============================================================ */}
      {view === "day" && (
        <div className="bg-neutral-900">
          {SLOTS.map((slot) => {
            const curDateStr = toDateString(currentDate);
            const dayAppts = appointmentsByDate.get(curDateStr) || [];
            const slotAppts = dayAppts.filter((a) => {
              return getAppointmentSlotKey(a.time) === slot.key;
            });

            return (
              <div
                key={slot.key}
                className={cn(
                  "grid grid-cols-[70px_1fr] min-h-[52px] hover:bg-neutral-800/25 transition-colors cursor-pointer group",
                  slot.isHalfHour
                    ? "border-t border-dashed border-neutral-800/40"
                    : "border-t border-neutral-800/90"
                )}
                onClick={() =>
                  handleSlotClick(curDateStr, slot.hour, slot.minute)
                }
              >
                {/* TIME COLUMN */}
                <div className="p-2 text-right pr-4 font-mono border-r border-neutral-800 flex items-start justify-end">
                  <span
                    className={cn(
                      slot.isHalfHour
                        ? "text-[11px] text-neutral-500 font-normal -mt-0.5"
                        : "text-xs font-semibold text-neutral-300 -mt-1"
                    )}
                  >
                    {slot.label}
                  </span>
                </div>

                {/* SLOT CONTENT */}
                <div className="p-2 relative flex items-center gap-3 flex-wrap">
                  {slotAppts.length === 0 ? (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 text-xs text-neutral-500 transition-opacity pl-2">
                      <Plus className="h-3.5 w-3.5 text-neutral-400" />
                      <span>Clicca per inserire allenamento alle {slot.label}</span>
                    </div>
                  ) : (
                    slotAppts.map((appt) => {
                      const style = getAppointmentBadgeStyles(appt);
                      const client = (appt as any).user;
                      const clientId = client?.id || (appt as any).userId;
                      const clientName = client
                        ? `${client.name} ${client.surname}`
                        : "Cliente";

                      return (
                        <div
                          key={appt.id}
                          onClick={(e) => handleAppointmentClick(e, appt)}
                          className={cn(
                            "p-2.5 rounded-xl border flex items-center justify-between gap-4 max-w-lg w-full shadow-sm hover:scale-[1.01] transition-all cursor-pointer",
                            style.bg
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-neutral-900/60 border border-neutral-700/60 flex items-center justify-center shrink-0">
                              <Dumbbell className="h-4 w-4 text-white" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white truncate">
                                  {isClientPage ? "Allenamento" : clientName}
                                </span>
                                {appt.paidBySubscription && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                    Abbonamento #{appt.subscriptionId}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-neutral-400 mt-0.5 font-mono">
                                <span className="flex items-center gap-1 text-neutral-300">
                                  <Clock className="h-3 w-3" />
                                  <span>h{appt.time}</span>
                                </span>
                                <span>•</span>
                                <span>{style.label}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {!appt.paid && !appt.paidBySubscription ? (
                              <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                <AlertTriangle className="h-3 w-3" />
                                <span>Da saldare</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Regolare</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CALENDAR FOOTER LEGEND */}
      <div className="p-3.5 sm:p-4 bg-neutral-950/40 border-t border-neutral-800 flex items-center justify-between flex-wrap gap-3 text-xs text-neutral-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-neutral-300">Legenda:</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-400 border border-blue-300" />
            <span>Abbonamento</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 border border-emerald-300" />
            <span>Saldato</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 border border-amber-300" />
            <span>Da pagare</span>
          </span>
        </div>

        <div className="text-[11px] text-neutral-500">
          💡 Clicca su uno slot orario per aggiungere un allenamento, o su una card per modificarla.
        </div>
      </div>
    </div>
  );
};

export default AppointmentsCalendar;

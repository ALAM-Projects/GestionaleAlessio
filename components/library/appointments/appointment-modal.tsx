"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { upsertAppointment } from "@/app/api/appointments/upsertAppointment";
import { createRecurringAppointments } from "@/app/api/appointments/createRecurringAppointments";
import { GroupUser } from "@/app/api/user/getUsersList";
import { Combobox } from "@/components/ui/combobox";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Dumbbell,
  Loader2,
  Repeat,
  X,
} from "lucide-react";

function generateWeeklyDates(startDate: string, weeks: number): string[] {
  const dates: string[] = [];
  const base = new Date(startDate);
  for (let i = 0; i < weeks; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i * 7);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

export const AppointmentModal = ({ ...props }) => {
  const {
    appointmentData,
    setAppointmentData,
    clientId,
    modalOpen,
    setModalOpen,
    reloadPageData,
    hasAvailableSubscriptionTrainings,
    usersList,
    addUsersSelect,
  } = props;

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringWeeks, setRecurringWeeks] = useState(4);

  const closeModal = () => {
    setModalOpen(false);
    setAppointmentData({});
    setIsRecurring(false);
    setRecurringWeeks(4);
    setError("");
  };

  const previewDates = useMemo(() => {
    if (!isRecurring || !appointmentData?.date || recurringWeeks < 1) return [];
    return generateWeeklyDates(appointmentData.date, recurringWeeks);
  }, [isRecurring, appointmentData?.date, recurringWeeks]);

  const handleUpsertAppointment = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRecurring) {
        const result = await createRecurringAppointments(
          appointmentData?.userId ? appointmentData?.userId : clientId,
          previewDates,
          appointmentData?.time,
          Number(appointmentData?.price) || 0,
        );
        if (result.created > 0) {
          setIsLoading(false);
          closeModal();
          reloadPageData();
        }
      } else {
        const created = await upsertAppointment(
          appointmentData?.userId ? appointmentData?.userId : clientId,
          appointmentData?.date,
          appointmentData?.time,
          Number(appointmentData?.price),
          appointmentData?.id || null,
        );

        if (created) {
          setIsLoading(false);
          closeModal();
          reloadPageData();
        }
      }
    } catch (error) {
      setError("Inserire guadagno, il cliente non ha un abbonamento attivo.");
      setIsLoading(false);
    }
  };

  const buttonDisabled = useMemo(() => {
    if (!appointmentData?.date || !appointmentData?.time) return true;
    if (addUsersSelect && !appointmentData?.userId) return true;
    if (isRecurring && (recurringWeeks < 1 || previewDates.length === 0)) return true;
    if (
      !addUsersSelect &&
      !hasAvailableSubscriptionTrainings &&
      !appointmentData?.price
    )
      return true;
    return false;
  }, [
    appointmentData,
    addUsersSelect,
    hasAvailableSubscriptionTrainings,
    isRecurring,
    recurringWeeks,
    previewDates,
  ]);

  useEffect(() => {
    if (!appointmentData?.date) {
      setAppointmentData({
        ...appointmentData,
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [appointmentData?.userId]);

  const isEditMode = !!appointmentData?.id;

  return (
    <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
      <AlertDialogContent className="bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-7 max-w-lg text-white space-y-5">
        {/* HEADER */}
        <AlertDialogHeader className="space-y-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {isEditMode
                    ? "Modifica appuntamento"
                    : isRecurring
                    ? "Appuntamenti ricorrenti"
                    : "Nuovo appuntamento"}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {isEditMode
                    ? "Modifica data, ora e parametri dell'allenamento"
                    : "Inserisci data ed ora della seduta di allenamento"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="h-8 w-8 rounded-full bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </AlertDialogHeader>

        {/* TYPE TOGGLE: SINGOLO / RICORRENTE */}
        {!isEditMode && (
          <div className="p-1 rounded-xl bg-neutral-950/60 border border-neutral-800 flex gap-1">
            <button
              type="button"
              onClick={() => setIsRecurring(false)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                !isRecurring
                  ? "bg-neutral-800 text-white shadow-sm border border-neutral-700"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Singolo</span>
            </button>
            <button
              type="button"
              onClick={() => setIsRecurring(true)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                isRecurring
                  ? "bg-neutral-800 text-white shadow-sm border border-neutral-700"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <Repeat className="h-3.5 w-3.5" />
              <span>Ricorrente</span>
            </button>
          </div>
        )}

        {/* CLIENT SELECT (IF IN GENERAL DASHBOARD) */}
        {addUsersSelect && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Cliente
            </Label>
            <Combobox
              options={
                usersList?.map((user: GroupUser) => ({
                  value: user.id,
                  label: user.fullName,
                })) ?? []
              }
              value={appointmentData?.userId || ""}
              onValueChange={(value) =>
                setAppointmentData({ ...appointmentData, userId: value })
              }
              placeholder="Seleziona un cliente"
              searchPlaceholder="Cerca cliente..."
              emptyText="Nessun cliente trovato."
            />
          </div>
        )}

        {/* FORM GRID: DATA & ORA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-neutral-400" />
              <span>{isRecurring ? "Data di inizio" : "Data"}</span>
            </Label>
            <DatePicker
              value={appointmentData?.date || ""}
              onChange={(date) =>
                setAppointmentData({ ...appointmentData, date })
              }
              placeholder="Seleziona data..."
              className="w-full h-10 bg-neutral-800/80 border-neutral-700 text-white rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-neutral-400" />
              <span>Ora</span>
            </Label>
            <Input
              type="time"
              id="time"
              name="time"
              value={appointmentData?.time || ""}
              onChange={(e) =>
                setAppointmentData({ ...appointmentData, time: e.target.value })
              }
              className="h-10 bg-neutral-800/80 border-neutral-700 text-white rounded-xl px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
            />
          </div>
        </div>

        {/* RECURRING SETTINGS */}
        {isRecurring && (
          <div className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-800 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Numero di settimane
              </Label>
              <Input
                type="number"
                min={1}
                max={52}
                value={recurringWeeks}
                onChange={(e) => setRecurringWeeks(Number(e.target.value))}
                className="h-10 bg-neutral-800/80 border-neutral-700 text-white rounded-xl text-sm"
              />
            </div>

            {previewDates.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Anteprima ({previewDates.length} appuntamenti)
                </Label>
                <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                  {previewDates.map((d) => (
                    <div
                      key={d}
                      className="px-2.5 py-1 rounded-lg bg-neutral-800/60 border border-neutral-750 text-xs text-neutral-300 capitalize flex items-center justify-between"
                    >
                      <span>
                        {new Date(d).toLocaleDateString("it-IT", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {appointmentData?.time && (
                        <span className="text-neutral-400 text-[11px]">
                          h {appointmentData.time}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* GUADAGNO (IF NO ACTIVE SUBSCRIPTION OR GENERAL DASHBOARD) */}
        {!hasAvailableSubscriptionTrainings && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Guadagno (€)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-semibold">
                €
              </span>
              <Input
                type="number"
                id="price"
                name="price"
                placeholder="20"
                value={appointmentData?.price || ""}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    price: e.target.value,
                  })
                }
                className="h-10 pl-8 bg-neutral-800/80 border-neutral-700 text-white rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {addUsersSelect && (
              <p className="text-[11px] text-neutral-400">
                Se il cliente ha un abbonamento attivo con sedute disponibili, puoi lasciare vuoto.
              </p>
            )}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center gap-2 text-xs text-red-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* SAVE CTA BUTTON */}
        <Button
          type="button"
          disabled={buttonDisabled || isLoading}
          onClick={handleUpsertAppointment}
          variant="brand"
          className="w-full h-11 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Salvataggio in corso...</span>
            </>
          ) : isEditMode ? (
            "Salva modifiche"
          ) : (
            "Salva appuntamento"
          )}
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
};

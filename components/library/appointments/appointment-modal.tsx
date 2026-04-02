"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { upsertAppointment } from "@/app/api/appointments/upsertAppointment";
import { createRecurringAppointments } from "@/app/api/appointments/createRecurringAppointments";
import SuperButton from "../common/super-button";
import { GroupUser } from "@/app/api/user/getUsersList";
import { Combobox } from "@/components/ui/combobox";

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
  }, [appointmentData, addUsersSelect, hasAvailableSubscriptionTrainings, isRecurring, recurringWeeks, previewDates]);

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
      <AlertDialogContent className="border-0 bg-primary">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-start justify-between">
            <span className="text-3xl">
              {isRecurring ? "Appuntamenti ricorrenti" : "Nuovo appuntamento"}
            </span>
            <div
              className="text-white text-md cursor-pointer"
              onClick={() => closeModal()}
            >
              X
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Inserisci data ed ora del nuovo appuntamento
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!isEditMode && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsRecurring(false)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                !isRecurring
                  ? "bg-white text-primary"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Singolo
            </button>
            <button
              type="button"
              onClick={() => setIsRecurring(true)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                isRecurring
                  ? "bg-white text-primary"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Ricorrente
            </button>
          </div>
        )}

        <div className="gap-1.5">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="email">
            {isRecurring ? "Data di inizio" : "Data"}
          </Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={appointmentData?.date || ""}
            className="text-primary text-md"
            onChange={(e) =>
              setAppointmentData({ ...appointmentData, date: e.target.value })
            }
          />
        </div>
        <div className="gap-1.5">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="email">
            Ora
          </Label>
          <Input
            type="time"
            id="time"
            name="time"
            className="text-primary text-md"
            placeholder=""
            value={appointmentData?.time || ""}
            onChange={(e) =>
              setAppointmentData({ ...appointmentData, time: e.target.value })
            }
          />
        </div>

        {isRecurring && (
          <>
            <div className="gap-1.5">
              <Label className="text-neutral-400 font-bold text-md">
                Numero di settimane
              </Label>
              <Input
                type="number"
                min={1}
                max={52}
                className="text-primary text-md"
                value={recurringWeeks}
                onChange={(e) => setRecurringWeeks(Number(e.target.value))}
              />
            </div>
            {previewDates.length > 0 && (
              <div className="gap-1.5">
                <Label className="text-neutral-400 font-bold text-md">
                  Anteprima ({previewDates.length} appuntamenti)
                </Label>
                <ul className="text-white text-sm max-h-40 overflow-y-auto space-y-1 mt-1">
                  {previewDates.map((d) => (
                    <li key={d} className="text-neutral-300">
                      {new Date(d).toLocaleDateString("it-IT", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {addUsersSelect && (
          <div className="gap-1.5">
            <Label
              className="text-neutral-400 font-bold text-md"
              htmlFor="email"
            >
              Cliente
            </Label>
            <Combobox
              options={usersList?.map((user: GroupUser) => ({ value: user.id, label: user.fullName })) ?? []}
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
        {!hasAvailableSubscriptionTrainings && (
          <>
            <div className="gap-1.5">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="email"
              >
                Guadagno
              </Label>
              <Input
                type="number"
                id="price"
                name="price"
                className="text-primary text-md"
                placeholder="eg. 20€"
                value={appointmentData?.price || ""}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    price: e.target.value,
                  })
                }
              />
              {addUsersSelect && (
                <p className="text-neutral-400 text-sm">
                  Se il cliente ha un abbonamento attivo, lasciare vuoto.
                </p>
              )}
            </div>
          </>
        )}

        <div className="mx-auto mb-5">
          {error && (
            <p className="text-red-500 mt-4 bg-red-500/10 p-2 px-3 rounded-md">
              {error}
            </p>
          )}
        </div>

        <SuperButton
          disabled={buttonDisabled}
          onClick={(e) => handleUpsertAppointment(e)}
          text="Salva"
          isLoading={isLoading}
          variant="brand"
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};

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
import SuperButton from "../common/super-button";
import { GroupUser } from "@/app/api/user/getUsersList";
import { Select } from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";

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

  const closeModal = () => {
    setModalOpen(false);
    setAppointmentData({});
  };

  const handleUpsertAppointment = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
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
    } catch (error) {
      setError("Inserire guadagno, il cliente non ha un abbonamento attivo.");
      setIsLoading(false);
    }
  };

  const buttonDisabled = useMemo(() => {
    if (!appointmentData?.date || !appointmentData?.time) return true;
    if (addUsersSelect && !appointmentData?.userId) return true;
    if (
      !addUsersSelect &&
      !hasAvailableSubscriptionTrainings &&
      !appointmentData?.price
    )
      return true;
    return false;
  }, [appointmentData, addUsersSelect, hasAvailableSubscriptionTrainings]);

  useEffect(() => {
    setAppointmentData({
      ...appointmentData,
      date: new Date().toISOString().split("T")[0],
    });
  }, [appointmentData?.userId]);

  return (
    <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
      <AlertDialogContent className="border-0 bg-primary">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-start justify-between">
            <span className="text-3xl">Nuovo appuntamento</span>
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

        <div className="gap-1.5">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="email">
            Data
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
        {addUsersSelect && (
          <div className="gap-1.5">
            <Label
              className="text-neutral-400 font-bold text-md"
              htmlFor="email"
            >
              Cliente
            </Label>
            <Select
              value={appointmentData?.userId || ""}
              onValueChange={(value) => {
                setAppointmentData({ ...appointmentData, userId: value });
              }}
            >
              <SelectTrigger className="bg-white text-black">
                <SelectValue placeholder="Seleziona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {usersList?.map((user: GroupUser) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

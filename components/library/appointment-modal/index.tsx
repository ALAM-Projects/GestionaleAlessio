"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
import { createAppointment } from "@/app/actions/appointments/createAppointment";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const AppointmentModal = ({ ...props }) => {
  const [open, setOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>({});
  const [error, setError] = useState("");

  const clientId = props.clientId;

  useEffect(() => {
    setOpen(true);
  }, []);

  const closeModal = () => {
    setOpen(false);
  };

  const handleCreateAppointment = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const created = await createAppointment(
      clientId,
      appointmentData?.date,
      appointmentData?.time,
      Number(appointmentData?.price)
    );

    if (created) {
      setOpen(false);
      // Create a new URLSearchParams object without the 'appointment' parameter
      const newSearchParams = new URLSearchParams(
        Object.entries(props.searchParams).map(([key, value]) => [
          key,
          String(value),
        ])
      );
      newSearchParams.delete("appointment");

      // Construct the new URL
      const newPathname = window.location.pathname;
      const newSearch = newSearchParams.toString();
      const newUrl = newPathname + (newSearch ? `?${newSearch}` : "");

      // Update the URL without adding a new history entry
      window.history.replaceState({}, "", newUrl);
      props.getClient();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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
            className="text-primary text-md"
            onChange={(e) =>
              setAppointmentData({ ...appointmentData, date: e.target.value })
            }
          />
        </div>
        <div className="gap-1.5">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="email">
            Data
          </Label>
          <Input
            type="time"
            id="time"
            name="time"
            className="text-primary text-md"
            placeholder=""
            onChange={(e) =>
              setAppointmentData({ ...appointmentData, time: e.target.value })
            }
          />
        </div>
        <div className="gap-1.5">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="email">
            Guadagno
          </Label>
          <Input
            type="number"
            id="price"
            name="price"
            className="text-primary text-md"
            placeholder="eg. 20€"
            onChange={(e) =>
              setAppointmentData({ ...appointmentData, price: e.target.value })
            }
          />
        </div>
        {/* {!clientId && (
          <div className="gap-1.5">
            <Label
              className="text-neutral-400 font-bold text-md"
              htmlFor="email"
            >
              Cliente
            </Label>
          </div>
        )} */}
        <div className="mx-auto mb-5">
          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center text-white">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => handleCreateAppointment(e)}
            className="bg-brand hover:bg-brand w-full"
          >
            Crea
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

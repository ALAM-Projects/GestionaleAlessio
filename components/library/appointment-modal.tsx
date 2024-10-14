"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { createAppointment } from "@/app/actions/appointments/createAppointment";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Button } from "../ui/button";
import { UserWithFullName } from "@/prisma/user-extension";
import { cn } from "@/lib/utils";

export const AppointmentModal = ({ ...props }) => {
  const [appointmentData, setAppointmentData] = useState<any>({});
  const [error, setError] = useState("");
  const [coupleTraining, setCoupleTraining] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [popoverValue, setPopoverValue] = useState<string>();

  const clientId = props.clientId;
  const modalOpen = props.modalOpen;
  const setModalOpen = props.setModalOpen;
  const allUsers = props.allUsers;

  const closeModal = () => {
    setModalOpen(false);
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
      setModalOpen(false);
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
        <div className="items-top flex space-x-2">
          <Checkbox
            id="coupleTraining"
            className="border-white border-2"
            onClick={() => setCoupleTraining(!coupleTraining)}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="coupleTraining"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
            >
              Allenamento di coppia
            </label>
            <p className="text-sm text-muted-foreground">
              Seleziona se l'allenamento è di coppia
            </p>
          </div>
        </div>
        {coupleTraining && (
          <div className="z-50">
            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPopover}
                  className="w-full justify-between"
                >
                  {popoverValue
                    ? allUsers.find(
                        (user: UserWithFullName) => user.id === popoverValue
                      )?.fullName
                    : "Select framework..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 ">
                <Command>
                  <CommandInput placeholder="Cerca cliente..." />
                  <CommandList>
                    <CommandEmpty>Nessun cliente trovato.</CommandEmpty>
                    <CommandGroup className="z-50">
                      {allUsers.map((user: UserWithFullName) => (
                        <CommandItem
                          key={user.fullName}
                          value={user.fullName}
                          onSelect={(currentValue) => {
                            setPopoverValue(
                              currentValue === user.id ? "" : currentValue
                            );
                            setOpenPopover(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              popoverValue === user.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {user.fullName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
        <div className="mx-auto mb-5">
          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center text-white">
              {error}
            </p>
          )}
        </div>
        {/* <AlertDialogFooter className="z-30">
          <AlertDialogAction
            onClick={(e) => handleCreateAppointment(e)}
            className="bg-brand hover:bg-brand w-full"
          >
            Crea
          </AlertDialogAction>
        </AlertDialogFooter> */}
      </AlertDialogContent>
    </AlertDialog>
  );
};

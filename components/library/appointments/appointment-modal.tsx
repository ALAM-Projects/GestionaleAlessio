"use client";

import { useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import SuperButton from "../common/super-button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { GroupUser } from "@/app/api/user/getUsersList";

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
  } = props;

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [groupTraining, setGroupTraining] = useState(false);
  const [selectedPersons, setSelectedPersons] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");

  const closeModal = () => {
    setModalOpen(false);
    setAppointmentData({});
  };

  const handleUpsertAppointment = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setIsLoading(true);

    const created = await upsertAppointment(
      clientId,
      appointmentData?.date,
      appointmentData?.time,
      Number(appointmentData?.price),
      appointmentData?.location,
      appointmentData?.id || null,
    );

    if (created) {
      setIsLoading(false);
      closeModal();
      reloadPageData();
    }
  };

  const buttonDisabled = useMemo(() => {
    if (
      !appointmentData?.date ||
      !appointmentData?.time ||
      !appointmentData?.location ||
      (!hasAvailableSubscriptionTrainings && !appointmentData?.price)
    )
      return true;
    return false;
  }, [appointmentData]);

  const handleGroupPeople = (user: GroupUser) => {
    setSelectedPersons([...selectedPersons, user.id]);
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
        <div className="gap-1.5">
          <Label
            className="text-neutral-400 font-bold text-md"
            htmlFor="location"
          >
            Luogo
          </Label>
          <Select
            value={appointmentData?.location || ""}
            onValueChange={(value) => {
              setAppointmentData({
                ...appointmentData,
                location: value,
              });
            }}
          >
            <SelectTrigger className="bg-white text-black">
              <SelectValue placeholder="Seleziona una risposta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Casa">Casa</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Domicilio">Domicilio</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            </div>
            <div className="items-top flex space-x-2">
              <Checkbox
                id="coupleTraining"
                className="border-white border-2"
                onClick={() => setGroupTraining(!groupTraining)}
              />
              <div className="grid leading-none">
                <label
                  htmlFor="coupleTraining"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                >
                  Allenamento di gruppo
                </label>
                <p className="text-sm text-muted-foreground">
                  Seleziona se l'allenamento è di gruppo
                </p>
              </div>
            </div>
          </>
        )}
        {groupTraining && (
          <>
            <Label className="text-white">Altri partecipanti:</Label>
            <Combobox
              value={selectedPersons}
              onChange={(selected: string[]) => setSelectedPersons(selected)}
              onClose={() => setQuery("")}
              multiple={true}
            >
              <ComboboxInput
                aria-label="Assignee"
                displayValue={(selectedPersons: string[]) =>
                  selectedPersons.length + " selezionati"
                }
                onChange={(event) => setQuery(event.target.value)}
              />
              <ComboboxOptions
                anchor="bottom"
                className="border empty:invisible"
              >
                {usersList?.map((user: GroupUser) => (
                  <ComboboxOption
                    key={user.id}
                    value={user}
                    className="data-[focus]:bg-blue-100"
                  >
                    {user.fullName}
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </Combobox>
          </>
        )}
        <div className="mx-auto mb-5">
          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center text-white">
              {error}
            </p>
          )}
        </div>

        <SuperButton
          disabled={buttonDisabled}
          onClick={(e) => handleUpsertAppointment(e)}
          text="Salva"
          isLoading={isLoading}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};

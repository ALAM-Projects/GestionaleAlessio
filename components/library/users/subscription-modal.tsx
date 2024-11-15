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
import SuperButton from "../common/super-button";
import { upsertSubscription } from "@/app/actions/subscriptions/upsertSubscription";

export const SubscriptionModal = ({ ...props }) => {
  const {
    subscriptionData,
    setSubscriptionData,
    clientId,
    modalOpen,
    setModalOpen,
    reloadPageData,
  } = props;

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
    setSubscriptionData({});
  };

  const handleUpsertSubscription = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsLoading(true);

    const created = await upsertSubscription(
      Number(subscriptionData?.totalPrice),
      Number(subscriptionData?.totalPaid),
      Number(subscriptionData?.appointmentsIncluded),
      subscriptionData?.completed,
      clientId,
      Number(subscriptionData?.doneAppointments),
      subscriptionData?.id
    );

    if (created) {
      setIsLoading(false);
      closeModal();
      reloadPageData();
    }
  };

  const buttonDisabled = useMemo(() => {
    if (
      !subscriptionData?.totalPrice ||
      !subscriptionData?.totalPaid ||
      !subscriptionData?.appointmentsIncluded ||
      subscriptionData?.totalPrice < subscriptionData?.totalPaid
    )
      return true;
    return false;
  }, [subscriptionData]);

  return (
    <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
      <AlertDialogContent className="border-0 bg-primary">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-start justify-between">
            <span className="text-3xl">Nuovo abbonamento</span>
            <div
              className="text-white text-md cursor-pointer"
              onClick={() => closeModal()}
            >
              X
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Inserisci le informazioni richieste
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="gap-1.5">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="email">
            Numero allenamennti
          </Label>
          <Input
            type="number"
            id="appointmentsIncluded"
            name="appointmentsIncluded"
            disabled={subscriptionData?.id ? true : false}
            placeholder="eg. 10"
            value={subscriptionData?.appointmentsIncluded || ""}
            className="text-primary text-md"
            onChange={(e) =>
              setSubscriptionData({
                ...subscriptionData,
                appointmentsIncluded: e.target.value,
              })
            }
          />
        </div>
        <div className="gap-1.5">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="email">
            Già pagati
          </Label>
          <Input
            type="number"
            id="totalPaid"
            name="totalPaid"
            className="text-primary text-md"
            placeholder="eg. 50€"
            value={subscriptionData?.totalPaid || ""}
            onChange={(e) =>
              setSubscriptionData({
                ...subscriptionData,
                totalPaid: e.target.value,
              })
            }
          />
        </div>
        <div className="gap-1.5">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="email">
            Prezzo totale
          </Label>
          <Input
            type="number"
            id="totalPrice"
            name="totalPrice"
            className="text-primary text-md"
            disabled={subscriptionData?.id ? true : false}
            placeholder="eg. 200€"
            value={subscriptionData?.totalPrice || ""}
            onChange={(e) =>
              setSubscriptionData({
                ...subscriptionData,
                totalPrice: e.target.value,
              })
            }
          />
        </div>
        <div className="mx-auto mb-5">
          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center text-white">
              {error}
            </p>
          )}
        </div>

        <SuperButton
          disabled={buttonDisabled}
          onClick={(e) => handleUpsertSubscription(e)}
          text="Salva"
          isLoading={isLoading}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};

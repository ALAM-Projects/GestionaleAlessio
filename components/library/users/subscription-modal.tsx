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
import SuperButton from "../common/super-button";
import { upsertSubscription } from "@/app/api/subscriptions/upsertSubscription";
import {
  calculateInstallments,
  formatDateIT,
  getTodayDateString,
  parseInstallments,
  PaymentType,
  SubscriptionInstallment,
  redistributeInstallments,
  updateInstallmentDates,
} from "@/lib/subscription-helpers";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";

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
  const [rawInputAmounts, setRawInputAmounts] = useState<{ [key: number]: string }>({});

  const isEdit = !!subscriptionData?.id;

  // Initialize dates and paymentType
  useEffect(() => {
    if (modalOpen) {
      setError("");
      setRawInputAmounts({});
      if (!isEdit) {
        setSubscriptionData((prev: any) => {
          const today = getTodayDateString();
          const paymentType = prev?.paymentType || "FULL";
          const totalPrice = Number(prev?.totalPrice || 0);
          const { totalPaid, installments } = calculateInstallments(
            totalPrice,
            paymentType,
            today,
          );

          return {
            ...prev,
            advancePaymentDate: prev?.advancePaymentDate || today,
            paymentType,
            totalPaid,
            installments,
          };
        });
      }
    }
  }, [modalOpen, isEdit]);

  const closeModal = () => {
    setModalOpen(false);
    setSubscriptionData({});
    setRawInputAmounts({});
    setError("");
  };

  const handlePaymentTypeChange = (newType: PaymentType) => {
    setRawInputAmounts({});
    const price = Number(subscriptionData?.totalPrice || 0);
    const date = subscriptionData?.advancePaymentDate || getTodayDateString();
    const { totalPaid, installments } = calculateInstallments(
      price,
      newType,
      date,
    );

    setSubscriptionData({
      ...subscriptionData,
      paymentType: newType,
      totalPaid,
      installments,
    });
  };

  const handlePriceChange = (priceVal: string) => {
    setRawInputAmounts({});
    const price = Number(priceVal);
    const currentType: PaymentType = subscriptionData?.paymentType || "FULL";
    const date = subscriptionData?.advancePaymentDate || getTodayDateString();
    const { totalPaid, installments } = calculateInstallments(
      price,
      currentType,
      date,
    );

    setSubscriptionData({
      ...subscriptionData,
      totalPrice: priceVal,
      totalPaid,
      installments,
    });
  };

  const handleStartDateChange = (newDate: string) => {
    const currentInstallments = subscriptionData?.installments || [];
    const updated = updateInstallmentDates(currentInstallments, newDate);

    setSubscriptionData({
      ...subscriptionData,
      advancePaymentDate: newDate,
      installments: updated,
    });
  };

  const handleInstallmentAmountChange = (instNumber: number, valStr: string) => {
    const price = Number(subscriptionData?.totalPrice || 0);
    const paymentType = subscriptionData?.paymentType || "FULL";
    const currentInstallments = subscriptionData?.installments || [];
    const advDate = subscriptionData?.advancePaymentDate || getTodayDateString();

    if (instNumber === 1) {
      setRawInputAmounts((prev) => {
        const next: Record<number, string> = { ...prev, [1]: valStr };
        delete next[2];
        return next;
      });
    } else if (instNumber === 2) {
      setRawInputAmounts((prev) => ({ ...prev, [2]: valStr }));
    }

    const newAmount = valStr === "" ? 0 : Math.max(0, parseInt(valStr, 10) || 0);
    const result = redistributeInstallments(
      price,
      paymentType,
      currentInstallments,
      instNumber,
      newAmount,
      advDate,
    );

    setSubscriptionData({
      ...subscriptionData,
      installments: result.installments,
      totalPaid: result.totalPaid,
    });
  };

  const handleInstallmentInputBlur = (instNumber: number) => {
    setRawInputAmounts((prev) => {
      const next: Record<number, string> = { ...prev };
      delete next[instNumber];
      return next;
    });
  };

  const handleUpsertSubscription = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const totalPrice = Number(subscriptionData?.totalPrice);
    const appointmentsIncluded = Number(subscriptionData?.appointmentsIncluded);
    const advancePaymentDate =
      subscriptionData?.advancePaymentDate || getTodayDateString();
    const expirationDate = subscriptionData?.expirationDate || null;
    const paymentType: PaymentType = subscriptionData?.paymentType || "FULL";

    // Recalculate or preserve installments
    let installments = subscriptionData?.installments;
    let totalPaid = Number(subscriptionData?.totalPaid ?? 0);

    if (!isEdit || !installments || installments.length === 0) {
      const calc = calculateInstallments(
        totalPrice,
        paymentType,
        advancePaymentDate,
      );
      installments = calc.installments;
      totalPaid = calc.totalPaid;
    }

    const created = await upsertSubscription(
      totalPrice,
      totalPaid,
      appointmentsIncluded,
      subscriptionData?.completed ?? false,
      clientId,
      Number(subscriptionData?.doneAppointments || 0),
      subscriptionData?.id,
      advancePaymentDate,
      expirationDate,
      paymentType,
      installments,
    );

    if (created) {
      setIsLoading(false);
      closeModal();
      reloadPageData();
    } else {
      setIsLoading(false);
      setError("Errore durante il salvataggio dell'abbonamento.");
    }
  };

  const currentInstallments: SubscriptionInstallment[] = useMemo(() => {
    return parseInstallments(subscriptionData?.installments);
  }, [subscriptionData?.installments]);

  const installmentsSum = useMemo(() => {
    return currentInstallments.reduce((sum, i) => sum + i.amount, 0);
  }, [currentInstallments]);

  const hasNegativeInstallment = useMemo(() => {
    return currentInstallments.some((i) => i.amount < 0 || isNaN(i.amount));
  }, [currentInstallments]);

  const sumMismatch = useMemo(() => {
    const price = Number(subscriptionData?.totalPrice || 0);
    return price > 0 && currentInstallments.length > 0 && installmentsSum !== price;
  }, [subscriptionData?.totalPrice, currentInstallments, installmentsSum]);

  const buttonDisabled = useMemo(() => {
    const price = Number(subscriptionData?.totalPrice);
    const included = Number(subscriptionData?.appointmentsIncluded);

    if (!price || price <= 0 || !included || included <= 0) return true;
    if (hasNegativeInstallment || sumMismatch) return true;
    return false;
  }, [subscriptionData, hasNegativeInstallment, sumMismatch]);

  const currentPaymentType: PaymentType =
    subscriptionData?.paymentType || "FULL";

  return (
    <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
      <AlertDialogContent className="border-0 bg-neutral-900 text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-start justify-between">
            <span className="text-2xl font-bold">
              {subscriptionData?.id
                ? `Modifica abbonamento #${subscriptionData.id}`
                : "Nuovo abbonamento"}
            </span>
            <div
              className="text-neutral-400 hover:text-white text-lg cursor-pointer px-2"
              onClick={() => closeModal()}
            >
              ✕
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-400">
            Inserisci le informazioni e seleziona la modalità di pagamento
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 my-2">
          {/* NUMERO ALLENAMENTI */}
          <div className="space-y-1.5">
            <Label className="text-neutral-300 font-semibold text-sm">
              Numero allenamenti
            </Label>
            <Input
              type="number"
              id="appointmentsIncluded"
              name="appointmentsIncluded"
              placeholder="es. 10"
              value={subscriptionData?.appointmentsIncluded || ""}
              className="text-white bg-neutral-800 border-neutral-700"
              onChange={(e) =>
                setSubscriptionData({
                  ...subscriptionData,
                  appointmentsIncluded: e.target.value,
                })
              }
            />
          </div>

          {/* PREZZO TOTALE */}
          <div className="space-y-1.5">
            <Label className="text-neutral-300 font-semibold text-sm">
              Prezzo totale (€)
            </Label>
            <Input
              type="number"
              id="totalPrice"
              name="totalPrice"
              className="text-white bg-neutral-800 border-neutral-700"
              placeholder="es. 300"
              value={subscriptionData?.totalPrice || ""}
              onChange={(e) => handlePriceChange(e.target.value)}
            />
          </div>

          {/* DATA CREAZIONE / ANTICIPO */}
          <div className="space-y-1.5">
            <Label className="text-neutral-300 font-semibold text-sm">
              Data anticipo / creazione
            </Label>
            <Input
              type="date"
              id="advancePaymentDate"
              name="advancePaymentDate"
              className="text-white bg-neutral-800 border-neutral-700"
              value={
                subscriptionData?.advancePaymentDate || getTodayDateString()
              }
              onChange={(e) => handleStartDateChange(e.target.value)}
            />
          </div>

          {/* MODALITA' DI PAGAMENTO */}
          <div className="space-y-2">
            <Label className="text-neutral-300 font-semibold text-sm">
              Modalità di pagamento
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePaymentTypeChange("FULL")}
                className={`px-2.5 py-2 rounded-md text-xs sm:text-sm font-semibold border transition-all text-center ${
                  currentPaymentType === "FULL"
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-sm"
                    : "bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                Saldato tutto
              </button>
              <button
                type="button"
                onClick={() => handlePaymentTypeChange("INSTALLMENTS_2")}
                className={`px-2.5 py-2 rounded-md text-xs sm:text-sm font-semibold border transition-all text-center ${
                  currentPaymentType === "INSTALLMENTS_2"
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-sm"
                    : "bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                In 2 rate
              </button>
              <button
                type="button"
                onClick={() => handlePaymentTypeChange("INSTALLMENTS_3")}
                className={`px-2.5 py-2 rounded-md text-xs sm:text-sm font-semibold border transition-all text-center ${
                  currentPaymentType === "INSTALLMENTS_3"
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-sm"
                    : "bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                In 3 rate
              </button>
            </div>
          </div>

          {/* ANTEPRIMA RATE AUTOMATICHE */}
          {Number(subscriptionData?.totalPrice || 0) > 0 && (
            <div className="p-3.5 rounded-lg bg-neutral-800/90 border border-neutral-700/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                <span>Piano rate calcolato</span>
                <span className="text-emerald-400 font-bold">
                  Incassato: €{subscriptionData?.totalPaid ?? 0} su €
                  {subscriptionData?.totalPrice}
                </span>
              </div>

              <div className="space-y-2">
                {currentInstallments.map((inst) => {
                  const isEditable =
                    (currentPaymentType === "INSTALLMENTS_2" && inst.installmentNumber === 1) ||
                    (currentPaymentType === "INSTALLMENTS_3" &&
                      (inst.installmentNumber === 1 || inst.installmentNumber === 2));

                  const isRemainder =
                    (currentPaymentType === "INSTALLMENTS_2" && inst.installmentNumber === 2) ||
                    (currentPaymentType === "INSTALLMENTS_3" && inst.installmentNumber === 3);

                  return (
                    <div
                      key={inst.installmentNumber}
                      className={`flex items-center justify-between p-2 rounded-md text-xs sm:text-sm ${
                        inst.paid
                          ? "bg-emerald-950/40 border border-emerald-600/40 text-emerald-200"
                          : "bg-amber-950/30 border border-amber-600/30 text-amber-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {inst.paid ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                        )}
                        <span className="font-semibold whitespace-nowrap">
                          Rata {inst.installmentNumber}:
                        </span>
                        {isEditable ? (
                          <div className="relative flex items-center">
                            <span className="text-neutral-400 text-xs mr-0.5">€</span>
                            <Input
                              type="number"
                              min={0}
                              step={1}
                              value={rawInputAmounts[inst.installmentNumber] ?? inst.amount}
                              onChange={(e) =>
                                handleInstallmentAmountChange(
                                  inst.installmentNumber,
                                  e.target.value,
                                )
                              }
                              onBlur={() =>
                                handleInstallmentInputBlur(inst.installmentNumber)
                              }
                              className="w-20 h-7 px-1.5 py-0 text-xs bg-neutral-900 border-neutral-700 text-white font-bold rounded focus:border-brand"
                            />
                          </div>
                        ) : (
                          <span className="font-semibold text-neutral-200">
                            €{inst.amount}
                            {isRemainder && (
                              <span className="text-[10px] text-neutral-400 ml-1 font-normal italic">
                                (Residuo)
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs opacity-80">
                          {inst.paid
                            ? `Pagata (${formatDateIT(inst.paidDate || inst.dueDate)})`
                            : `Scadenza ${formatDateIT(inst.dueDate)}`}
                        </span>
                        <Badge
                          variant={inst.paid ? "success" : "dangerOutline"}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {inst.paid ? "Pagata" : "Da saldare"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}

                {hasNegativeInstallment && (
                  <div className="p-2 rounded bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
                    ⚠️ Gli importi non possono superare il prezzo totale.
                  </div>
                )}
                {!hasNegativeInstallment && sumMismatch && (
                  <div className="p-2 rounded bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs">
                    ⚠️ La somma delle rate (€{installmentsSum}) deve corrispondere a €{subscriptionData?.totalPrice}.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DATA SCADENZA ABBONAMENTO (OPZIONALE) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label className="text-neutral-300 font-semibold text-sm">
                Data di scadenza abbonamento (opzionale)
              </Label>
              {subscriptionData?.expirationDate && (
                <button
                  type="button"
                  onClick={() =>
                    setSubscriptionData({
                      ...subscriptionData,
                      expirationDate: "",
                    })
                  }
                  className="text-xs text-neutral-400 hover:text-red-400 underline"
                >
                  Rimuovi scadenza
                </button>
              )}
            </div>
            <Input
              type="date"
              id="expirationDate"
              name="expirationDate"
              className="text-white bg-neutral-800 border-neutral-700"
              value={subscriptionData?.expirationDate || ""}
              onChange={(e) =>
                setSubscriptionData({
                  ...subscriptionData,
                  expirationDate: e.target.value,
                })
              }
            />
          </div>
        </div>

        {error && (
          <div className="p-2 rounded bg-red-950/60 border border-red-500/50 text-red-200 text-xs text-center">
            {error}
          </div>
        )}

        <div className="mt-4">
          <SuperButton
            disabled={buttonDisabled}
            onClick={(e) => handleUpsertSubscription(e)}
            text="Salva abbonamento"
            isLoading={isLoading}
            variant="brand"
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

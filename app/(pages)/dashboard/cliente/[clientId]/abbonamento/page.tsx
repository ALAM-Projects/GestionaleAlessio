"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/app/(layouts)/dashboard";
import { getUserById } from "@/app/api/user/getUserById";
import { SuperUser } from "@/prisma/user-extension";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SuperButton from "@/components/library/common/super-button";
import { Button } from "@/components/ui/button";
import { upsertSubscription } from "@/app/api/subscriptions/upsertSubscription";
import {
  calculateInstallments,
  formatDateIT,
  getTodayDateString,
  parseInstallments,
  PaymentType,
  SubscriptionInstallment,
} from "@/lib/subscription-helpers";
import { Badge } from "@/components/ui/badge";
import Spinner from "@/components/ui/spinner";
import { CheckCircle2, Clock } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

export default function SubscriptionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const clientId = params?.clientId as string;
  const subscriptionIdParam = searchParams.get("subscriptionId");
  const subscriptionId = subscriptionIdParam ? Number(subscriptionIdParam) : undefined;
  const isEdit = !!subscriptionId;

  const [user, setUser] = useState<SuperUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [appointmentsIncluded, setAppointmentsIncluded] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<string>("");
  const [advancePaymentDate, setAdvancePaymentDate] = useState<string>(getTodayDateString());
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [paymentType, setPaymentType] = useState<PaymentType>("FULL");
  const [doneAppointments, setDoneAppointments] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserAndSub = async () => {
      if (!clientId) return;
      setLoading(true);
      const userData = await getUserById(clientId);
      setUser(userData);

      if (userData && subscriptionId) {
        const sub = userData.subscriptions?.find((s) => s.id === subscriptionId);
        if (sub) {
          setAppointmentsIncluded(String(sub.appointmentsIncluded || ""));
          setTotalPrice(String(sub.totalPrice || ""));
          setAdvancePaymentDate(sub.advancePaymentDate || getTodayDateString());
          setExpirationDate((sub as any).expirationDate || "");
          setPaymentType(((sub as any).paymentType as PaymentType) || "FULL");
          setDoneAppointments(sub.doneAppointments || 0);
          setIsCompleted(sub.completed || false);
        }
      }
      setLoading(false);
    };

    fetchUserAndSub();
  }, [clientId, subscriptionId]);

  const { totalPaid, calculatedInstallments } = useMemo(() => {
    const price = Number(totalPrice || 0);
    const date = advancePaymentDate || getTodayDateString();
    const { totalPaid: paid, installments } = calculateInstallments(
      price,
      paymentType,
      date,
    );
    return { totalPaid: paid, calculatedInstallments: installments };
  }, [totalPrice, paymentType, advancePaymentDate]);

  const buttonDisabled = useMemo(() => {
    const price = Number(totalPrice);
    const included = Number(appointmentsIncluded);
    if (!price || price <= 0 || !included || included <= 0) return true;
    return false;
  }, [totalPrice, appointmentsIncluded]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (buttonDisabled) return;

    setIsSaving(true);
    setError("");

    const price = Number(totalPrice);
    const included = Number(appointmentsIncluded);

    const success = await upsertSubscription(
      price,
      totalPaid,
      included,
      isCompleted,
      clientId,
      doneAppointments,
      subscriptionId,
      advancePaymentDate || getTodayDateString(),
      expirationDate || null,
      paymentType,
      calculatedInstallments,
    );

    if (success) {
      router.push(`/dashboard/cliente/${clientId}`);
    } else {
      setIsSaving(false);
      setError("Si è verificato un errore durante il salvataggio dell'abbonamento.");
    }
  };

  return (
    <DashboardLayout
      linkText="Torna alla scheda cliente"
      link={`/dashboard/cliente/${clientId}`}
    >
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" color="border-white" />
        </div>
      ) : (
        <div className="w-full mt-4 pb-16">
          {/* CLIENT INDICATION */}
          <div className="mt-4 mb-2 flex items-center justify-between text-neutral-400 text-base">
            <div>
              Cliente:{" "}
              <span className="text-white font-semibold text-xl">
                {user ? `${user.name} ${user.surname}` : clientId}
              </span>
              {isEdit && (
                <span className="ml-3 text-neutral-400 text-sm">
                  (Modifica abbonamento #{subscriptionId})
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-950/70 border border-red-500/60 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* MAIN FORM GRID */}
          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-4 items-stretch">
            {/* LEFT COLUMN: INPUTS */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-xl flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white border-b border-neutral-800 pb-3">
                    Configurazione Abbonamento
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* NUMERO ALLENAMENTI */}
                    <div className="space-y-2">
                      <Label className="text-neutral-300 font-medium text-sm">
                        Numero allenamenti
                      </Label>
                      <Input
                        type="number"
                        placeholder="es. 10"
                        value={appointmentsIncluded}
                        onChange={(e) => setAppointmentsIncluded(e.target.value)}
                        className="bg-neutral-800 border-neutral-700 text-white text-base h-11"
                        required
                      />
                    </div>

                    {/* PREZZO TOTALE */}
                    <div className="space-y-2">
                      <Label className="text-neutral-300 font-medium text-sm">
                        Prezzo totale (€)
                      </Label>
                      <Input
                        type="number"
                        placeholder="es. 300"
                        value={totalPrice}
                        onChange={(e) => setTotalPrice(e.target.value)}
                        className="bg-neutral-800 border-neutral-700 text-white text-base h-11"
                        required
                      />
                    </div>
                  </div>

                  {/* DATA INIZIO / ANTICIPO */}
                  <div className="space-y-2">
                    <Label className="text-neutral-300 font-medium text-sm">
                      Data anticipo / inizio
                    </Label>
                    <DatePicker
                      value={advancePaymentDate}
                      onChange={(val) => setAdvancePaymentDate(val)}
                      placeholder="Seleziona data inizio"
                      className="w-full h-11 bg-neutral-800 border-neutral-700 text-white text-base"
                    />
                    <p className="text-xs text-neutral-400">
                      A partire da questa data la 1ª rata sarà considerata versata e si attiveranno gli alert di saldo.
                    </p>
                  </div>

                  {/* MODALITA' DI PAGAMENTO */}
                  <div className="space-y-3">
                    <Label className="text-neutral-300 font-medium text-sm">
                      Modalità di pagamento
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentType("FULL")}
                        className={`p-3 rounded-lg border text-sm font-semibold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                          paymentType === "FULL"
                            ? "bg-emerald-600 border-emerald-500 text-white shadow-md ring-2 ring-emerald-400/40"
                            : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-750"
                        }`}
                      >
                        <span>Saldato tutto</span>
                        <span className="text-[11px] font-normal opacity-80">1 sola rata</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentType("INSTALLMENTS_2")}
                        className={`p-3 rounded-lg border text-sm font-semibold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                          paymentType === "INSTALLMENTS_2"
                            ? "bg-emerald-600 border-emerald-500 text-white shadow-md ring-2 ring-emerald-400/40"
                            : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-750"
                        }`}
                      >
                        <span>In 2 rate</span>
                        <span className="text-[11px] font-normal opacity-80">Subito + 1 mese</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentType("INSTALLMENTS_3")}
                        className={`p-3 rounded-lg border text-sm font-semibold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                          paymentType === "INSTALLMENTS_3"
                            ? "bg-emerald-600 border-emerald-500 text-white shadow-md ring-2 ring-emerald-400/40"
                            : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-750"
                        }`}
                      >
                        <span>In 3 rate</span>
                        <span className="text-[11px] font-normal opacity-80">Subito + 1 e 2 mesi</span>
                      </button>
                    </div>
                  </div>

                  {/* DATA SCADENZA (OPZIONALE) */}
                  <div className="space-y-2 pt-2 border-t border-neutral-800">
                    <div className="flex justify-between items-center">
                      <Label className="text-neutral-300 font-medium text-sm">
                        Data di scadenza abbonamento (opzionale)
                      </Label>
                      {expirationDate && (
                        <button
                          type="button"
                          onClick={() => setExpirationDate("")}
                          className="text-xs text-neutral-400 hover:text-red-400 underline"
                        >
                          Rimuovi scadenza
                        </button>
                      )}
                    </div>
                    <DatePicker
                      value={expirationDate}
                      onChange={(val) => setExpirationDate(val)}
                      placeholder="Nessuna scadenza (opzionale)"
                      className="w-full h-11 bg-neutral-800 border-neutral-700 text-white text-base"
                    />
                    <p className="text-xs text-neutral-400">
                      Se impostata, comparirà nella colonna scadenza della tabella abbonamenti.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PREVIEW & ACTIONS */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-xl flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-white border-b border-neutral-800 pb-3 flex items-center justify-between">
                    <span>Riepilogo e Rate</span>
                    <span className="text-sm font-normal text-neutral-400">
                      {calculatedInstallments.length} {calculatedInstallments.length === 1 ? "rata" : "rate"}
                    </span>
                  </h2>

                  {/* SALDO STATS */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-neutral-800/80 border border-neutral-700">
                      <div className="text-xs text-neutral-400">Incassato subito</div>
                      <div className="text-xl font-bold text-emerald-400">
                        €{totalPaid}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-neutral-800/80 border border-neutral-700">
                      <div className="text-xs text-neutral-400">Residuo da saldare</div>
                      <div className="text-xl font-bold text-amber-400">
                        €{Math.max(0, Number(totalPrice || 0) - totalPaid)}
                      </div>
                    </div>
                  </div>

                  {/* RATE LIST */}
                  <div className="space-y-3">
                    {calculatedInstallments.map((inst) => (
                      <div
                        key={inst.installmentNumber}
                        className={`p-3.5 rounded-lg border flex items-center justify-between transition-all ${
                          inst.paid
                            ? "bg-emerald-950/30 border-emerald-600/40 text-emerald-200"
                            : "bg-amber-950/25 border-amber-600/35 text-amber-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {inst.paid ? (
                            <div className="h-8 w-8 rounded-full bg-emerald-900/60 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-amber-900/60 flex items-center justify-center shrink-0">
                              <Clock className="h-5 w-5 text-amber-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-base text-white">
                              Rata {inst.installmentNumber}: €{inst.amount}
                            </div>
                            <div className="text-xs text-neutral-400">
                              {inst.paid
                                ? `Pagata oggi (${formatDateIT(inst.paidDate || inst.dueDate)})`
                                : `Scadenza: ${formatDateIT(inst.dueDate)}`}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={inst.paid ? "success" : "dangerOutline"}
                          className="px-2 py-0.5"
                        >
                          {inst.paid ? "Pagata" : "Da saldare"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="space-y-2 pt-4 border-t border-neutral-800 mt-auto">
                  <SuperButton
                    disabled={buttonDisabled}
                    onClick={(e) => handleSave(e)}
                    text={isEdit ? "Aggiorna abbonamento" : "Crea abbonamento"}
                    isLoading={isSaving}
                    variant="brand"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent text-neutral-300 border-neutral-700 hover:bg-neutral-800"
                    onClick={() => router.push(`/dashboard/cliente/${clientId}`)}
                  >
                    Annulla
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}

import { Button } from "@/components/ui/button";
import { SubscriptionsTable } from "./subscriptions.table";
import { useRouter } from "next/navigation";
import { CreditCard, Plus } from "lucide-react";

const SubscriptionsManager = ({ ...props }) => {
  const router = useRouter();
  const {
    subscriptions,
    clientId,
    isClientPage = true,
    showButton = true,
    canCreateSubscription = true,
    subscriptionBlockReason = "",
    getPageInfo,
    setAppointmentModalOpen,
    setSubscriptionModalOpen,
    setAppointmentData,
    setSubscriptionData,
  } = props;

  return (
    <div className="mt-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-hidden">
      {/* HEADER BAR */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-neutral-850 via-neutral-900 to-neutral-850 border-b border-neutral-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Tutti gli Abbonamenti
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                {subscriptions?.length ?? 0} {subscriptions?.length === 1 ? "abbonamento" : "abbonamenti"}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Storico pacchetti, rateizzazioni e stato pagamenti
            </p>
          </div>
        </div>

        {showButton && clientId && (
          <div className="flex flex-col items-end">
            <Button
              variant="brand"
              size="sm"
              onClick={() =>
                router.push(`/dashboard/cliente/${clientId}/abbonamento`)
              }
              className="h-9 px-4 text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand/20 shrink-0"
              disabled={!canCreateSubscription}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nuovo abbonamento</span>
            </Button>
            {!canCreateSubscription && subscriptionBlockReason && (
              <p className="text-[11px] text-neutral-400 mt-1 max-w-xs text-right">
                {subscriptionBlockReason}
              </p>
            )}
          </div>
        )}
      </div>

      {/* TABLE DIRECT IN CARD */}
      <SubscriptionsTable
        subscriptions={subscriptions}
        isClientPage={isClientPage}
        setModalOpen={setAppointmentModalOpen}
        clientId={clientId}
        getPageInfo={() => getPageInfo()}
        setAppointmentData={setAppointmentData}
        setSubscriptionModalOpen={setSubscriptionModalOpen}
        setSubscriptionData={setSubscriptionData}
      />
    </div>
  );
};

export default SubscriptionsManager;

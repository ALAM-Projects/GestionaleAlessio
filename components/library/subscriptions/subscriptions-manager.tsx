import { Button } from "@/components/ui/button";
import { SubscriptionsTable } from "./subscriptions.table";

const SubscriptionsManager = ({ ...props }) => {
  const {
    subscriptions,
    clientId,
    isClientPage = true,
    showButton = true,
    showSubscriptionButton,
    getPageInfo,
    setAppointmentModalOpen,
    setSubscriptionModalOpen,
    setAppointmentData,
  } = props;

  return (
    <>
      <div className="flex justify-between items-center mt-10">
        <h2 className="text-2xl lg:text-4xl font-bold my-3 text-white">
          Abbonamenti
        </h2>
        {showButton && (
          <div>
            {showSubscriptionButton && (
              <Button
                variant={"outline"}
                size={"lg"}
                onClick={() => setSubscriptionModalOpen(true)}
                className="text-lg"
              >
                Crea nuovo abbonamento
              </Button>
            )}
          </div>
        )}
      </div>
      <SubscriptionsTable
        subscriptions={subscriptions}
        isClientPage={isClientPage}
        setModalOpen={setAppointmentModalOpen}
        clientId={clientId}
        getPageInfo={() => getPageInfo()}
        setAppointmentData={setAppointmentData}
      />
    </>
  );
};

export default SubscriptionsManager;

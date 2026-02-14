import { Button } from "@/components/ui/button";
import { AppointmentsTable } from "./appointments.table";

const AppointmentManager = ({ ...props }) => {
  const {
    appointments,
    clientId,
    isClientPage = true,
    showButton = true,
    showSubscriptionButton,
    getPageInfo,
    setAppointmentModalOpen,
    setModalOpen,
    setSubscriptionModalOpen,
    setAppointmentData,
  } = props;

  const openAppointmentModal =
    setAppointmentModalOpen ?? setModalOpen;

  return (
    <>
      <div className="flex justify-between items-center mt-10">
        <h2 className="text-2xl lg:text-4xl font-bold my-3 text-white">
          Allenamenti
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
            <Button
              variant={"brand"}
              size={"lg"}
              onClick={() => openAppointmentModal(true)}
              className="text-lg ms-5"
            >
              Crea nuovo appuntamento
            </Button>
          </div>
        )}
      </div>
      <AppointmentsTable
        appointments={appointments}
        isClientPage={isClientPage}
        setModalOpen={openAppointmentModal}
        clientId={clientId}
        getPageInfo={() => getPageInfo()}
        setAppointmentData={setAppointmentData}
      />
    </>
  );
};

export default AppointmentManager;

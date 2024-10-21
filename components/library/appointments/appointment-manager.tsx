import { Button } from "@/components/ui/button";
import { AppointmentsTable } from "./appointments.table";

const AppointmentManager = ({ ...props }) => {
  const {
    appointments,
    clientId,
    isClientPage = true,
    showButton = true,
    getPageInfo,
    setModalOpen,
    setAppointmentData,
  } = props;

  return (
    <>
      <div className="flex justify-between items-center mt-10">
        <h2 className="text-2xl lg:text-4xl font-bold my-3 text-white">
          Allenamenti
        </h2>
        {showButton && (
          <Button
            variant={"brand"}
            size={"lg"}
            onClick={() => setModalOpen(true)}
            className="text-lg"
          >
            Crea nuovo appuntamento
          </Button>
        )}
      </div>
      <AppointmentsTable
        appointments={appointments}
        isClientPage={isClientPage}
        setModalOpen={setModalOpen}
        clientId={clientId}
        getPageInfo={() => getPageInfo()}
        setAppointmentData={setAppointmentData}
      />
    </>
  );
};

export default AppointmentManager;

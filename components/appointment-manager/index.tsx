import { AppointmentsTable } from "../library/appointments.table";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const AppointmentManager = ({ ...props }) => {
  const {
    appointments,
    clientId,
    isClientPage = true,
    showButton = true,
    getPageInfo,
    setModalOpen,
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
        clientId={clientId}
        getPageInfo={() => getPageInfo()}
      />
    </>
  );
};

export default AppointmentManager;

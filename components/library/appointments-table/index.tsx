import TableBody from "./table-body";
import TableHead from "./table-head";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Appointment } from "@prisma/client";
import { Card } from "@/components/ui/card";

export type AppointmentsTableProps = {
  showButton?: boolean;
  appointments?: Appointment[];
  getAppointments: () => void;
};

const AppointmentsTable = (props: AppointmentsTableProps) => {
  const { showButton = true, appointments } = props;

  const router = useRouter();

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
            onClick={() => router.push("?appointment=true")}
            className="text-lg"
          >
            Crea nuovo appuntamento
          </Button>
        )}
      </div>
      <Card className="px-4 py-5">
        <TableHead />
        <TableBody appointments={appointments} />
      </Card>
    </>
  );
};

export default AppointmentsTable;

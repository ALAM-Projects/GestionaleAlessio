import { Badge } from "@/components/ui/badge";
import { AppointmentsTableProps } from "..";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { editAppointment } from "@/app/actions/appointments/editAppointment";

const TableBody = (props: AppointmentsTableProps) => {
  const { appointments, getAppointments } = props;

  const handleEditAppointment = async (
    appointmentId: string,
    date?: string,
    status?: string,
    paid?: boolean,
    price?: number,
    time?: string
  ) => {
    const updatedAppointment = await editAppointment(
      appointmentId,
      date,
      status,
      paid,
      price,
      time
    );

    if (updatedAppointment) {
      getAppointments;
    }
  };

  return (
    <div>
      {appointments?.length ? (
        appointments.map((app, index) => (
          <div key={index}>
            <div className="grid grid-cols-12 gap-5 py-2 pb-4 border-b ">
              <div className="text-md font-semibold text-neutral-200 col-span-3">
                {app.user.name + " " + app.user.surname}
              </div>
              <div className="text-md font-semibold text-neutral-200 col-span-1">
                {app.date}
              </div>
              <div className="text-md font-semibold text-neutral-200 col-span-1">
                h{app.time}
              </div>
              <div className="col-span-1">
                <Badge
                  className=""
                  variant={
                    app.status === "isConfirmed"
                      ? "successOutline"
                      : "dangerOutline"
                  }
                >
                  {app.status}
                </Badge>
              </div>
              <div className="text-md font-semibold text-neutral-200 col-span-1">
                {app.price + "€"}
              </div>
              <div className="text-md font-semibold text-neutral-200 col-span-2">
                <Badge
                  className=""
                  variant={app.paid ? "success" : "destructive"}
                >
                  {app.paid ? "Pagato" : "Da pagare"}
                </Badge>
              </div>
              <div className="ml-auto col-span-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className=" h-8 w-8 p-0 border">
                      <span className="sr-only">Apri menù</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                    <DropdownMenuItem
                    // onClick={() => {
                    //   router.push("/dashboard/cliente/" + client.id);
                    // }}
                    >
                      Modifica appuntamento
                    </DropdownMenuItem>
                    <DropdownMenuLabel>Azioni rapide</DropdownMenuLabel>
                    {/* // TODO: aggiungere chiamata per annullare appuntamento */}
                    <DropdownMenuItem
                      onClick={() => {
                        const newStatus =
                          app.status === "Confermato"
                            ? "Annullato"
                            : "Confermato";
                        handleEditAppointment(
                          app.id,
                          undefined,
                          newStatus,
                          undefined,
                          undefined
                        );
                      }}
                    >
                      {app.status === "Confermato"
                        ? "Annulla appuntamento"
                        : "Conferma appuntamento"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleEditAppointment(
                          app.id,
                          undefined,
                          undefined,
                          !app.paid,
                          undefined
                        )
                      }
                    >
                      {app.paid ? "Segna come DA PAGARE" : "Segna come PAGATO"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-3xl mt-10 text-neutral-300 font-bold">
          Nessun appuntamento trovato
        </div>
      )}
    </div>
  );
};

export default TableBody;

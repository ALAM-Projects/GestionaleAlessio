"use client";

import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Appointment, User } from "@prisma/client";

import { deleteAppointment } from "@/app/actions/appointments/deleteAppointment";
import { Badge } from "@/components/ui/badge";
import { editAppointmentStatusOrPaid } from "@/app/actions/appointments/editAppointmentStatusOrPaid";
import { AppointmentStatus } from "@/types/db_types";

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-trasparent hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cliente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const client = row.getValue("user") as User;

      return (
        <div className="text-left font-medium">
          {client ? client.name + " " + client.surname : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-trasparent hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date");
      return <div className="capitalize">{date as string}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-trasparent hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ora
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const time = row.getValue("time");
      return <div className="">h{time as string}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "location",
    header: () => {
      return <div className="text-left">Luogo</div>;
    },
    cell: ({ row }) => {
      const location = row.getValue("location");
      let badgeVariant: "home" | "online" | "residence" = "home";
      if (location === "Online") badgeVariant = "online";
      if (location === "Domicilio") badgeVariant = "residence";

      return (
        <Badge className="" variant={badgeVariant}>
          {location as string}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-trasparent hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stato
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isConfirmed =
        row.getValue("status") === AppointmentStatus.Confermato;
      return (
        <Badge
          className=""
          variant={isConfirmed ? "successOutline" : "dangerOutline"}
        >
          {row.getValue("status")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-left">Guadagno</div>,
    cell: ({ row }) => {
      const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(row.getValue("price"));

      return <div className="text-left font-medium">{formattedPrice}</div>;
    },
  },
  {
    accessorKey: "paid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-trasparent hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pagato
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const appointmentCanceled = row.getValue("status") === "Annullato";
      if (appointmentCanceled) return null;
      return (
        <Badge
          className=""
          variant={row.getValue("paid") ? "success" : "destructive"}
        >
          {row.getValue("paid") ? "Pagato" : "Da pagare"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paidBySubscription",
    header: () => <div className="text-left">Abbonamento</div>,
    cell: ({ row }) => {
      const isSubscriptionAppointment = row.getValue("paidBySubscription");
      if (!isSubscriptionAppointment) return null;
      return (
        <Badge className="" variant={"online"}>
          Incluso
        </Badge>
      );
    },
  },
];

export function AppointmentsTable({ ...props }) {
  const { appointments, isClientPage, setModalOpen, setAppointmentData } =
    props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const data = appointments;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleEditAppointmentStatusOrPaid = async (
    appointmentId: string,
    status?: string,
    paid?: boolean
  ) => {
    const updatedAppointment = await editAppointmentStatusOrPaid(
      appointmentId,
      status,
      paid
    );

    if (updatedAppointment) {
      props.getPageInfo();
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    const deleted = await deleteAppointment(appointmentId);

    if (deleted) {
      props.getPageInfo();
    }
  };

  return (
    <div className="w-full mt-5">
      <div className="flex justify-between items-center pb-4">
        <Input
          type="date"
          placeholder="Filtra per data..."
          value={(table.getColumn("date")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("date")?.setFilterValue(event.target.value);
          }}
          className="w-2/3 md:w-4/5 xl:w-4/12"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-4 bg-neutral-200 text-primary"
            >
              Colonne <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-neutral-800" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.id == "user" && isClientPage) return null;
                  else
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <>
                  <TableRow
                    key={row.id}
                    className="hover:bg-neutral-800 text-white text-lg"
                    // data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.id == "user" && isClientPage) return null;
                      else
                        return (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                    })}
                    <TableCell className="text-white">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className=" h-8 w-8 p-0">
                            <span className="sr-only">Apri menù</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setModalOpen(true);
                              setAppointmentData(row.original);
                            }}
                          >
                            Modifica appuntamento
                          </DropdownMenuItem>
                          <DropdownMenuLabel>Azioni rapide</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              const newStatus =
                                row.original.status ===
                                AppointmentStatus.Confermato
                                  ? "Annullato"
                                  : "Confermato";
                              handleEditAppointmentStatusOrPaid(
                                row.original.id,
                                newStatus,
                                false
                              );
                            }}
                          >
                            {row.original.status ===
                            AppointmentStatus.Confermato
                              ? "Annulla appuntamento"
                              : "Conferma appuntamento"}
                          </DropdownMenuItem>
                          {row.original.status ===
                          AppointmentStatus.Confermato ? (
                            <DropdownMenuItem
                              onClick={() =>
                                handleEditAppointmentStatusOrPaid(
                                  row.original.id,
                                  undefined,
                                  !row.original.paid
                                )
                              }
                            >
                              {row.original.paid
                                ? "Segna come DA PAGARE"
                                : "Segna come PAGATO"}
                            </DropdownMenuItem>
                          ) : null}
                          {row.original.status ===
                          AppointmentStatus.Annullato ? (
                            <>
                              <DropdownMenuLabel>
                                Azioni irreversibili
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  handleDeleteAppointment(row.original.id);
                                }}
                              >
                                Elimina appuntamento
                              </DropdownMenuItem>
                            </>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-white hover:bg-primary"
                >
                  Nessun risultato.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
        <div className="space-x-2">
          <Button
            variant={"dashboard"}
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className=""
          >
            Indietro
          </Button>
          <Button
            variant={"dashboard"}
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Avanti
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal, AlertTriangle } from "lucide-react";
import Link from "next/link";
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
import { DatePicker } from "@/components/ui/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Appointment, User } from "@prisma/client";

import { deleteAppointment } from "@/app/api/appointments/deleteAppointment";
import { Badge } from "@/components/ui/badge";
import { editAppointmentStatusOrPaid } from "@/app/api/appointments/editAppointmentStatusOrPaid";
import { AppointmentStatus } from "@/types/db_types";
import { useRouter } from "next/navigation";
import { getUserPaymentAlerts } from "@/lib/subscription-helpers";

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
    cell: ({ row, table }) => {
      const client = row.getValue("user") as any;
      const clientId = client?.id || (row.original as any)?.userId;

      return (
        <div className="text-left font-medium">
          {clientId ? (
            <Link
              href={`/dashboard/cliente/${clientId}`}
              className="text-white hover:underline hover:text-emerald-400 font-semibold transition-colors cursor-pointer"
            >
              {client ? `${client.name} ${client.surname}` : "Vedi cliente"}
            </Link>
          ) : (
            <div>{client ? `${client.name} ${client.surname}` : ""}</div>
          )}
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
    cell: ({ row, table }) => {
      const isSubscriptionAppointment = row.getValue("paidBySubscription");
      const subscriptionId = row.original.subscriptionId;

      if (!isSubscriptionAppointment && !subscriptionId) {
        return null;
      }

      const meta = table.options.meta as
        | { clientSubscriptions?: any[] }
        | undefined;
      const userSubscriptions =
        (row.original as any).user?.subscriptions ||
        meta?.clientSubscriptions ||
        [];
      const alerts = getUserPaymentAlerts(userSubscriptions);
      const subAlert = subscriptionId
        ? alerts.find((a) => a.subscriptionId === subscriptionId)
        : null;

      return (
        <div className="flex items-center gap-2 text-left">
          {isSubscriptionAppointment ? (
            <Badge className="w-fit" variant={"online"}>
              Incluso nell'abbonamento {subscriptionId || null}
            </Badge>
          ) : null}
          {subAlert && (
            <span
              title={subAlert.message}
              className={`inline-flex items-center justify-center p-1 rounded cursor-pointer shrink-0 transition-transform hover:scale-110 ${
                subAlert.isUrgent
                  ? "bg-red-950/70 border border-red-500/60 text-red-300 hover:text-red-200"
                  : "bg-amber-950/70 border border-amber-500/60 text-amber-400 hover:text-amber-300"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      );
    },
  },
];

export function AppointmentsTable({ ...props }) {
  const {
    appointments,
    clientSubscriptions,
    isClientPage,
    setModalOpen,
    setAppointmentData,
  } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const data = appointments;

  const table = useReactTable({
    data,
    columns,
    meta: {
      clientSubscriptions,
    },
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
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
    status?: AppointmentStatus,
    paid?: boolean,
  ) => {
    const updatedAppointment = await editAppointmentStatusOrPaid(
      appointmentId,
      status,
      paid,
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

  const router = useRouter();

  useEffect(() => {
    if (!isClientPage) {
      table
        .getColumn("date")
        ?.setFilterValue(new Date().toISOString().split("T")[0]);
      setSorting((prev) => [...prev, { id: "time", desc: false }]);
    } else {
      setSorting((prev) => [...prev, { id: "date", desc: true }]);
    }
  }, []);

  return (
    <div className="w-full">
      {/* TOP CONTROLS */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-neutral-800">
        <DatePicker
          value={(table.getColumn("date")?.getFilterValue() as string) ?? ""}
          onChange={(date) => {
            table.getColumn("date")?.setFilterValue(date || undefined);
          }}
          placeholder="Filtra per data..."
          className="w-48 sm:w-56"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-4 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border-neutral-700 h-9 text-xs"
            >
              Colonne <ChevronDown className="ml-2 h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 text-neutral-200">
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

      {/* TABLE */}
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-neutral-850/50 border-b border-neutral-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent border-b border-neutral-800" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.id == "user" && isClientPage) return null;
                  else
                    return (
                      <TableHead
                        key={header.id}
                        className="text-xs font-semibold text-neutral-400 uppercase tracking-wider py-3.5 first:pl-6 last:pr-6"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
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
                <TableRow
                  key={row.id}
                  className="hover:bg-neutral-850/40 text-white border-b border-neutral-800/60 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id == "user" && isClientPage) return null;
                    else
                      return (
                        <TableCell key={cell.id} className="py-3.5 first:pl-6 last:pr-6">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                  })}
                  <TableCell className="text-white py-3.5 pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-neutral-800">
                          <span className="sr-only">Apri menù</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 text-neutral-200">
                        <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                        {!isClientPage && (row.original.userId || (row.original as any).user?.id) && (
                          <DropdownMenuItem
                            onClick={() => {
                              const targetId = (row.original as any).user?.id || row.original.userId;
                              router.push(`/dashboard/cliente/${targetId}`);
                            }}
                          >
                            Vai alla scheda cliente
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            setAppointmentData(row.original);
                            setModalOpen(true);
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
                                ? AppointmentStatus.Annullato
                                : AppointmentStatus.Confermato;
                            handleEditAppointmentStatusOrPaid(
                              row.original.id,
                              newStatus,
                              false,
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
                                !row.original.paid,
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center text-neutral-400 hover:bg-transparent"
                >
                  Nessun appuntamento registrato.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-800">
        <div className="text-xs text-neutral-400">
          {table.getFilteredRowModel().rows.length} {table.getFilteredRowModel().rows.length === 1 ? "appuntamento" : "appuntamenti"}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 px-3 text-xs bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border-neutral-700 disabled:opacity-40"
          >
            Indietro
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 px-3 text-xs bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border-neutral-700 disabled:opacity-40"
          >
            Avanti
          </Button>
        </div>
      </div>
    </div>
  );
}

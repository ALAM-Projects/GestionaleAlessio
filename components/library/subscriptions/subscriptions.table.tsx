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
import { ArrowUpDown, MoreHorizontal, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
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
import { Subscription, User } from "@prisma/client";

import { deleteAppointment } from "@/app/api/appointments/deleteAppointment";
import { Badge } from "@/components/ui/badge";
import { editAppointmentStatusOrPaid } from "@/app/api/appointments/editAppointmentStatusOrPaid";
import { AppointmentStatus } from "@/types/db_types";

import {
  formatDateIT,
  getSubscriptionPaymentAlert,
  getTodayDateString,
  parseInstallments,
} from "@/lib/subscription-helpers";
import { payInstallment } from "@/app/api/subscriptions/payInstallment";

export const columns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-trasparent hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const id = row.getValue("id");
      const alert = getSubscriptionPaymentAlert(row.original);

      return (
        <div className="flex items-center gap-2 text-left font-medium">
          <span>#{id as string}</span>
          {alert && (
            <span
              title={alert.message}
              className={`inline-flex items-center justify-center p-1 rounded cursor-pointer shrink-0 transition-transform hover:scale-110 ${
                alert.isUrgent
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
    accessorKey: "completed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-trasparent hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const completed = row.getValue("completed");
      const totalPaid = row.getValue("totalPaid");
      const totalPrice = row.getValue("totalPrice");

      const status = completed && totalPaid === totalPrice;

      return (
        <Badge variant={status ? "success" : "successOutline"}>
          {status ? "Utilizzato" : "In corso"}
        </Badge>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "totalPrice",
    header: () => {
      return <div className="text-left">Prezzo totale</div>;
    },
    cell: ({ row }) => {
      const price = row.getValue("totalPrice");

      return <div className="font-semibold">€{price as string}</div>;
    },
  },
  {
    accessorKey: "totalPaid",
    header: () => {
      return <div className="text-left">Pagamento</div>;
    },
    cell: ({ row }) => {
      const paid = Number(row.getValue("totalPaid") || 0);
      const totalPrice = Number(row.getValue("totalPrice") || 0);
      const fullyPaid = paid >= totalPrice && totalPrice > 0;

      return (
        <div className="text-left">
          <Badge
            variant={fullyPaid ? "success" : "dangerOutline"}
            className="text-xs"
          >
            €{paid} / €{totalPrice}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "installments",
    header: () => <div className="text-left">Rate</div>,
    cell: ({ row }) => {
      const installments = parseInstallments((row.original as any).installments);
      const today = getTodayDateString();

      if (!installments || installments.length === 0) {
        return <span className="text-neutral-400 text-xs">-</span>;
      }

      return (
        <div className="flex flex-wrap gap-1.5 text-left">
          {installments.map((inst) => {
            const isOverdue = !inst.paid && today > inst.dueDate;
            return (
              <span
                key={inst.installmentNumber}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                  inst.paid
                    ? "bg-emerald-950/40 border-emerald-600/40 text-emerald-300"
                    : isOverdue
                    ? "bg-red-950/50 border-red-500/60 text-red-300 font-semibold"
                    : "bg-amber-950/40 border-amber-600/40 text-amber-300"
                }`}
              >
                <span>R{inst.installmentNumber}: €{inst.amount}</span>
                {inst.paid ? (
                  <span className="text-emerald-400 font-bold">✓</span>
                ) : isOverdue ? (
                  <span className="text-red-400 font-bold">⚠️ Scaduta</span>
                ) : (
                  <span className="text-amber-300/80 text-[10px]">
                    ⏳ {formatDateIT(inst.dueDate)}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "expirationDate",
    header: () => <div className="text-left">Scadenza</div>,
    cell: ({ row }) => {
      const expDate = (row.original as any).expirationDate;
      if (!expDate) return <span className="text-neutral-400 text-xs">-</span>;

      const today = getTodayDateString();
      const isExpired = today > expDate && !row.original.completed;

      return (
        <div className="text-left">
          {isExpired ? (
            <Badge variant="dangerOutline" className="text-xs">
              Scaduto il {formatDateIT(expDate)}
            </Badge>
          ) : (
            <span className="text-sm">{formatDateIT(expDate)}</span>
          )}
        </div>
      );
    },
  },
  {
    id: "appointmentsProgress",
    header: () => <div className="text-left">Allenamenti</div>,
    cell: ({ row }) => {
      const done = Number(row.original.doneAppointments || 0);
      const included = Number(row.original.appointmentsIncluded || 0);
      const isCompleted = done >= included && included > 0;

      return (
        <div className="text-left flex items-center gap-2">
          <span className="text-sm font-semibold text-white">
            {done} <span className="text-neutral-500 font-normal">/</span> {included}
          </span>
          {isCompleted && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
              Completati
            </span>
          )}
        </div>
      );
    },
  },
];

export function SubscriptionsTable({ ...props }) {
  const {
    subscriptions,
    isClientPage,
    setModalOpen,
    setAppointmentData,
    setSubscriptionModalOpen,
    setSubscriptionData,
  } = props;

  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const data = subscriptions;

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

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-neutral-850/50 border-b border-neutral-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent border-b border-neutral-800" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.id == "user" && isClientPage) return null;
                  else
                    return (
                      <TableHead key={header.id} className="text-xs font-semibold text-neutral-400 uppercase tracking-wider py-3.5 first:pl-6 last:pr-6">
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
                  {!(row.original.completed && row.original.totalPaid === row.original.totalPrice) && (
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
                          <DropdownMenuItem
                            onClick={() => {
                              router.push(
                                `/dashboard/cliente/${row.original.userId}/abbonamento?subscriptionId=${row.original.id}`,
                              );
                            }}
                          >
                            Modifica abbonamento
                          </DropdownMenuItem>
                          {(() => {
                            const insts = parseInstallments(
                              (row.original as any).installments,
                            );
                            const unpaid = insts.filter((i) => !i.paid);
                            if (unpaid.length === 0) return null;
                            return (
                              <>
                                <DropdownMenuLabel>Saldo rate</DropdownMenuLabel>
                                {unpaid.map((inst) => (
                                  <DropdownMenuItem
                                    key={inst.installmentNumber}
                                    className="text-emerald-400 font-medium cursor-pointer"
                                    onClick={async () => {
                                      const ok = await payInstallment(
                                        row.original.id,
                                        inst.installmentNumber,
                                      );
                                      if (ok && props.getPageInfo) {
                                        props.getPageInfo();
                                      }
                                    }}
                                  >
                                    Segna {inst.installmentNumber}ª rata come saldata (€{inst.amount})
                                  </DropdownMenuItem>
                                ))}
                              </>
                            );
                          })()}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center text-neutral-400 hover:bg-transparent"
                >
                  Nessun abbonamento registrato.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-800">
        <div className="text-xs text-neutral-400">
          {table.getFilteredRowModel().rows.length} {table.getFilteredRowModel().rows.length === 1 ? "abbonamento" : "abbonamenti"}
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

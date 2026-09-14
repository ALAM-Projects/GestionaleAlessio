"use client";

import * as React from "react";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal, AlertTriangle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clientsColumns } from "@/data/index";
import { SuperUser } from "@/prisma/user-extension";
import { AppointmentStatus } from "@/types/db_types";
import { Badge } from "@/components/ui/badge";
import { getUserPaymentAlerts } from "@/lib/subscription-helpers";

export const columns: ColumnDef<SuperUser>[] = [
  {
    accessorKey: "fullName",
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
      const fullName = row.getValue("fullName");
      const client = row.original as SuperUser;
      const alerts = getUserPaymentAlerts(client.subscriptions);

      return (
        <div className="flex items-center gap-2 text-left font-medium">
          <Link
            href={`/dashboard/cliente/${client.id}`}
            className="text-white hover:underline hover:text-emerald-400 font-semibold transition-colors cursor-pointer"
          >
            {fullName as string}
          </Link>
          {alerts.map((alert) => (
            <span
              key={alert.subscriptionId}
              title={alert.message}
              className={`inline-flex items-center justify-center p-1 rounded cursor-pointer shrink-0 transition-transform hover:scale-110 ${
                alert.isUrgent
                  ? "bg-red-950/70 border border-red-500/60 text-red-300 hover:text-red-200"
                  : "bg-amber-950/70 border border-amber-500/60 text-amber-400 hover:text-amber-300"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: () => {
      return "Telefono";
    },
    cell: ({ row }) => (
      <div className="">{(row.getValue("phone") as string)?.toString()}</div>
    ),
  },
  {
    accessorKey: "appointments",
    header: () => <div className="text-left">Da pagare</div>,
    cell: ({ row }) => {
      const appointments = row.getValue("appointments") as {
        price: number;
        paid: boolean;
        status: string;
      }[];

      const unpaidFromAppointments =
        appointments?.reduce((acc, { price, paid, status }) => {
          if (!paid && status === AppointmentStatus.Confermato)
            return acc + price;
          return acc;
        }, 0) ?? 0;

      const subscriptions = (row.original as SuperUser).subscriptions ?? [];
      const unpaidFromSubscriptions = subscriptions
        .filter((sub) => !sub.completed)
        .reduce((acc, sub) => acc + (sub.totalPrice - sub.totalPaid), 0);

      const totalUnpaid = unpaidFromAppointments + unpaidFromSubscriptions;
      const unpaidAmount = parseFloat(totalUnpaid.toString());

      const formattedUnpaidAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(unpaidAmount);

      return (
        <Badge
          variant={
            formattedUnpaidAmount === "€0.00"
              ? "successOutline"
              : "dangerOutline"
          }
          className="text-left font-medium"
        >
          {formattedUnpaidAmount}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const client = row.original;

      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className=" h-8 w-8 p-0">
              <span className="sr-only">Apri menù</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 text-neutral-200">
            <DropdownMenuLabel>Azioni</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                router.push("/dashboard/cliente/" + client.id);
              }}
            >
              Vedi Cliente
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                if (typeof client.phone === "bigint") {
                  await navigator.clipboard.writeText(client.phone.toString());
                } else {
                  await navigator.clipboard.writeText(client.phone);
                }
              }}
            >
              Copia numero di telefono
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function UsersTable({ ...props }) {
  const data = props.users;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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

  return (
    <div className="mt-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-hidden">
      {/* HEADER BAR */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-neutral-850 via-neutral-900 to-neutral-850 border-b border-neutral-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Clienti
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/30">
                {data?.length ?? 0} {data?.length === 1 ? "cliente" : "clienti"}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Elenco dei clienti registrati e relativo riepilogo pagamenti
            </p>
          </div>
        </div>
      </div>

      {/* TOP CONTROLS */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-neutral-800">
        <Input
          placeholder="Filtra clienti..."
          value={
            (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("fullName")?.setFilterValue(event.target.value)
          }
          className="w-48 sm:w-64 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 text-sm h-9"
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
                    {clientsColumns[column.id as keyof typeof clientsColumns]}
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
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5 first:pl-6 last:pr-6 text-white">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center text-neutral-400 hover:bg-transparent"
                >
                  Nessun risultato.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-800">
        <div className="text-xs text-neutral-400">
          {table.getFilteredRowModel().rows.length}{" "}
          {table.getFilteredRowModel().rows.length === 1 ? "cliente" : "clienti"}
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

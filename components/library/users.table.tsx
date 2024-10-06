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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { User } from "@prisma/client";
import { clientsColumns } from "@/data/index";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "surname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cognome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize ml-4">{row.getValue("surname")}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize ml-4">{row.getValue("name")}</div>
    ),
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
    header: () => <div className="text-left">Pagati / Da pagare</div>,
    cell: ({ row }) => {
      const totalPaid = (
        row.getValue("appointments") as { price: number; paid: boolean }[]
      )?.reduce((acc, { price, paid }) => {
        if (paid) return acc + price;
        return acc;
      }, 0);
      const totalUnpaid = (
        row.getValue("appointments") as { price: number; paid: boolean }[]
      )?.reduce((acc, { price, paid }) => {
        if (!paid) return acc + price;
        return acc;
      }, 0);
      const paidAmount = parseFloat(totalPaid?.toString());
      const unpaidAmount = parseFloat(totalUnpaid?.toString());

      // Format the amount as a dollar amount
      const formattedPaidAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(paidAmount);

      const formattedUnpaidAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(unpaidAmount);

      return (
        <div className="text-left font-medium">
          {formattedPaidAmount + " / " + formattedUnpaidAmount}
        </div>
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
          <DropdownMenuContent align="end">
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

export function UsersTable(users: any) {
  const data = users.users;

  const router = useRouter();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
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
    <div className="w-full mt-10 rounded-md">
      <h2 className="text-2xl lg:text-4xl font-bold my-3 text-primary text-white">
        Clienti
      </h2>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtra clienti..."
          value={(table.getColumn("surname")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("surname")?.setFilterValue(event.target.value)
          }
          className="w-2/3 md:w-4/5 xl:w-4/12 "
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto bg-neutral-200 text-primary"
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
                    {clientsColumns[column.id as keyof typeof clientsColumns]}
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
              <TableRow className="hover:bg-neutral-800 m" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
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
                <TableRow
                  className="hover:bg-neutral-800"
                  key={row.id}
                  // data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-white">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
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
            size="sm"
            variant={"dashboard"}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-primary"
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

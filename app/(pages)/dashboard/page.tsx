"use client";

import { withAuth } from "@/app/(hocs)/with-auth";
import { DataTableDemo } from "@/components/library/data.table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Update this path

function Dashboard() {
  return (
    <div className="p-10">
      <div className="flex gap-5 justify-center">
        <Card className="w-[25%] bg-tertiary text-primary">
          <CardHeader>
            <CardTitle>Allenamenti</CardTitle>
            <CardDescription>
              Il numero totale degli appuntamenti effettuati
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h5 className="text-5xl font-bold">25</h5>
          </CardContent>
        </Card>
        <Card className="w-[25%] bg-tertiary text-primary">
          <CardHeader>
            <CardTitle>Clienti</CardTitle>
            <CardDescription>
              Il numero totale dei clienti registrati
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h5 className="text-5xl font-bold">10</h5>
          </CardContent>
        </Card>
        <Card className="w-[25%] bg-tertiary text-primary">
          <CardHeader>
            <CardTitle>Ore lavorate</CardTitle>
            <CardDescription>
              Il numero totale delle ore lavorate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h5 className="text-5xl font-bold">25h</h5>
          </CardContent>
        </Card>
        <Card className="w-[25%] bg-tertiary text-primary">
          <CardHeader>
            <CardTitle>Guadagni</CardTitle>
            <CardDescription>
              Il numero totale dei guadagni realizzati
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h5 className="text-5xl font-bold">1.700€</h5>
          </CardContent>
        </Card>
      </div>

      <DataTableDemo />
    </div>
  );
}

export default withAuth(Dashboard);

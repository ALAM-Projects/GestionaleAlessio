"use server";

import { getClientStats } from "@/app/actions/dashboard/getClientStats";
import { getUserById } from "@/app/actions/user/getUserById";
import { SuperUser } from "@/prisma/user-extension";

import ClientPage from ".";

const Page = async ({ params }: SearchParamProps) => {
  const clientId = params.clientId;

  const serverStats = await getClientStats(clientId);
  const serverUser = await getUserById(clientId);

  return (
    <ClientPage
      serverStats={serverStats}
      serverUser={serverUser as SuperUser}
      clientId={clientId}
    />
  );
};

export default Page;

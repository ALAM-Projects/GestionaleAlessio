"use server";

import { getClientStats } from "@/app/actions/dashboard/getClientStats";
import { getUserById } from "@/app/actions/user/getUserById";
import { SuperUser } from "@/prisma/user-extension";

import ClientPage from ".";
import { getUsersList, GroupUser } from "@/app/actions/user/getUsersList";

const Page = async ({ params }: SearchParamProps) => {
  const clientId = params.clientId;

  const serverStats = await getClientStats(clientId);
  const serverUser = await getUserById(clientId);
  const serverUsersList = await getUsersList();

  return (
    <ClientPage
      serverStats={serverStats}
      serverUser={serverUser as SuperUser}
      serverUsersList={serverUsersList}
      clientId={clientId}
    />
  );
};

export default Page;

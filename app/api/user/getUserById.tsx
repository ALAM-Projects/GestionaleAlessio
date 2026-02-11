import type { SuperUser } from "@/prisma/user-extension";

async function getUserById(clientId: string): Promise<SuperUser | null> {
  const res = await fetch(`/api/user/getUserById?clientId=${clientId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}

export { getUserById };

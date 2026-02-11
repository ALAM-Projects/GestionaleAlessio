import type { SuperUser } from "@/prisma/user-extension";

async function getUsers(): Promise<SuperUser[]> {
  const res = await fetch("/api/user/getUsers", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

export { getUsers };

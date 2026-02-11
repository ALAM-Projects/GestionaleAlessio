export type GroupUser = {
  id: string;
  fullName: string;
};

async function getUsersList(): Promise<GroupUser[]> {
  const res = await fetch("/api/user/get-users-list", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users list");
  }

  return res.json();
}

export { getUsersList };

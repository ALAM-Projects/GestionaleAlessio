async function getStats(): Promise<DashboardStats> {
  const res = await fetch("/api/dashboard/getStats", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return res.json();
}

export { getStats };

async function getClientStats(clientId: string): Promise<DashboardStats> {
  const res = await fetch(`/api/dashboard/getClientStats?clientId=${clientId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch client stats");
  }

  return res.json();
}

export { getClientStats };

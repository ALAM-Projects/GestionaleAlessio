import type { User } from "@prisma/client";

async function createUser(clientData: ClientDataProps): Promise<User | any> {
  const res = await fetch("/api/user/createUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clientData),
  });

  if (res.status === 409) {
    const data = await res.json();
    return data.message;
  }

  if (!res.ok) {
    throw new Error("Errore nella creazione utente");
  }

  return res.json();
}

export { createUser };

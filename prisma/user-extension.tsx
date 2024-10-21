import { Prisma, User, Appointment } from "@prisma/client";

const userSelect = {
  id: true,
  name: true,
  surname: true,
  age: true,
  phone: true,
  height: true,
  weight: true,
  sex: true,
  currentlyTraining: true,
  currentTrainingRate: true,
  currentSport: true,
  personalTraining: true,
  inactivityPeriod: true,
  inactivityReason: true,
  goal: true,
  injuries: true,
  surgeries: true,
  problems: true,
  goalReason: true,
  appointments: true,
};

export type UserWithFullName = Prisma.UserGetPayload<{
  select: typeof userSelect;
}> & {
  fullName: string;
};

// export type UserWithFullName = Prisma.UserGetPayload<
//   typeof UserWithFullName
// > & {
//   fullName: string;
// };

export function extendUserWithFullName(
  user: User & { appointments?: Appointment[] }
): UserWithFullName {
  return {
    ...user,
    fullName: `${user.name} ${user.surname}`,
    appointments: user.appointments || [],
  };
}

export function extendArrayOfUsersWithFullName(
  users: (User & { appointments?: Appointment[] })[]
): UserWithFullName[] {
  return users.map((user) => ({
    ...user,
    fullName: `${user.name} ${user.surname}`,
    appointments: user.appointments || [],
  }));
}

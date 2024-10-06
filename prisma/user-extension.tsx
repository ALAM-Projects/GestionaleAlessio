import { Prisma, User, Appointment } from "@prisma/client";

const UserWithFullName = Prisma.validator<Prisma.UserArgs>()({
  select: {
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
  },
});

export type UserWithFullName = Prisma.UserGetPayload<
  typeof UserWithFullName
> & {
  fullName: string;
};

export function extendUserWithFullName(
  user: User & { appointments?: Appointment[] }
): UserWithFullName {
  return {
    ...user,
    fullName: `${user.name} ${user.surname}`,
    appointments: user.appointments || [],
  };
}

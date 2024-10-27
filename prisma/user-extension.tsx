import { Prisma, User, Appointment, Subscription } from "@prisma/client";

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
  subscriptions: true,
};

export type SuperUser = Prisma.UserGetPayload<{
  select: typeof userSelect;
}> & {
  fullName: string;
  hasActiveSubscription: boolean;
  hasAvailableSubscriptionTrainings: boolean;
};

/// Extend the user object with additional properties
export function extendUser(
  user: User & { appointments?: Appointment[]; subscriptions?: Subscription[] }
): SuperUser {
  return {
    ...user,
    fullName: `${user.name} ${user.surname}`,
    hasActiveSubscription: !!user.subscriptions?.find(
      (sub) => sub.completed === false || sub.totalPaid < sub.totalPrice
    ),
    hasAvailableSubscriptionTrainings: !!user.subscriptions?.find(
      (sub) => sub.completed === false
    ),
    appointments: user.appointments || [],
    subscriptions: user.subscriptions || [],
  };
}

/// Extend an array of users with additional properties
export function extendArrayOfUsers(
  users: (User & {
    appointments?: Appointment[];
    subscriptions?: Subscription[];
  })[]
): SuperUser[] {
  return users.map((user) => ({
    ...user,
    fullName: `${user.name} ${user.surname}`,
    hasActiveSubscription: !!user.subscriptions?.find(
      (sub) => sub.completed === false || sub.totalPaid < sub.totalPrice
    ),
    hasAvailableSubscriptionTrainings: !!user.subscriptions?.find(
      (sub) => sub.completed === false
    ),
    appointments: user.appointments || [],
    subscriptions: user.subscriptions || [],
  }));
}

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type ClientDataProps = {
  name: string;
  surname: string;
  phone: number;
  weight: number;
  height: number;
  goal: string;
  goalReason: string;
  age: number;
  injuries?: string;
  surgeries?: string;
  sex: string;
  currentlyTraining: string;
  currentTrainingRate?: string;
  currentSport?: string;
  personalTraining?: string;
  inactivityPeriod?: string;
  inactivityReason?: string;
  problems?: string;
};

declare type DashboardStats = {
  usersCount?: Number;
  trainingCount?: Number;
  earnings: String;
  workedHours?: String;
  unpaid?: String;
};

declare type CardStats = {
  id: string;
  title: string;
  description: string;
};

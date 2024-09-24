declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type ClientDataProps = {
  name: string;
  surname: string;
  phone: string;
  weight: number;
  height: number;
  goal: string;
  age: number;
  injuries: string;
  surgeries: string;
};

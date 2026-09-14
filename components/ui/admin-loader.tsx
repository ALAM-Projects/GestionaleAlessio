import Spinner, { SpinnerProps } from "@/components/ui/spinner";

export const AdminLoader = (props: SpinnerProps) => {
  return <Spinner size="lg" {...props} />;
};

export default AdminLoader;

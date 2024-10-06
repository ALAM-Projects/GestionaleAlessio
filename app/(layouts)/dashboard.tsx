import React, { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return <div className="p-10 min-h-screen">{children}</div>;
};

export default DashboardLayout;

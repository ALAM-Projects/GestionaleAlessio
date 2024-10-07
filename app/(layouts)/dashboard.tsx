import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
  linkText: string;
  link: string;
};

const DashboardLayout = (props: DashboardLayoutProps) => {
  return (
    <div className="p-10 min-h-screen">
      <div className="flex justify-between items-center">
        <Image
          src="/onboarding-banner.svg"
          height={400}
          width={500}
          alt="logo-banner"
          className="mr-auto mb-5"
        />
      </div>
      <Link href={props.link} className="text-white underline text-lg">
        {props.linkText}
      </Link>
      {props.children}
    </div>
  );
};

export default DashboardLayout;

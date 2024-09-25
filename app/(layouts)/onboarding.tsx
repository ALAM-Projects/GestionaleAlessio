import Image from "next/image";
import React, { ReactNode } from "react";

type OnboardingLayoutProps = {
  children: ReactNode;
};

const OnboardingLayout = (props: OnboardingLayoutProps) => {
  const { children } = props;
  return (
    <div className="grid xl:grid-cols-12 min-h-screen">
      <div className="col-span-6 w-full py-10 bg-neutral-300">
        <div className="max-w-[70%] mx-auto">
          <Image
            src={"/logo.svg"}
            height={150}
            width={150}
            alt="onboarding-pic"
            className="mx-auto"
          />
          {children}
        </div>
      </div>
      <div className="col-span-6 w-full">
        <Image
          src={"/onboarding.jpg"}
          height={1000}
          width={1000}
          alt="onboarding-pic"
          className="min-h-screen"
        />
      </div>
    </div>
  );
};

export default OnboardingLayout;

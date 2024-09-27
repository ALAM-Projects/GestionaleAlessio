import { Card } from "@/components/ui/card";
import Image from "next/image";
import React, { ReactNode } from "react";

type OnboardingLayoutProps = {
  children: ReactNode;
};

const OnboardingLayout = ({ children }: OnboardingLayoutProps) => {
  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row">
      {/* Background image for mobile */}
      <div className="absolute inset-0 z-0 lg:hidden">
        <Image
          src="/onboarding.jpg"
          layout="fill"
          objectFit="cover"
          alt="onboarding-background"
          priority
        />
      </div>

      {/* Left side (form) */}
      <div className="relative z-10 w-full lg:w-1/2 py-10 lg:bg-primary">
        <div className="max-w-[70%] mx-auto">
          <Image
            src="/logo.svg"
            height={150}
            width={150}
            alt="logo"
            className="mx-auto"
          />
          <Card className="p-10 mt-10 bg-neutral-800 border-none">
            {children}
          </Card>
        </div>
      </div>

      {/* Right side (image) - hidden on mobile */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/onboarding.jpg"
          layout="fill"
          objectFit="cover"
          alt="onboarding-pic"
          priority
        />
      </div>
    </div>
  );
};

export default OnboardingLayout;

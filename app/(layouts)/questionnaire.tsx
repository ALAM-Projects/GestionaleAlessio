import SuperButton from "@/components/library/common/super-button";
import Link from "next/link";
import React, { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
  isLoading: boolean;
  onAction: () => void;
  buttonDisabled: boolean;
  withAdminAccess?: boolean;
};

const QuestionnaireLayout = (props: DashboardLayoutProps) => {
  return (
    <>
      <h1 className="text-4xl text-white text-center font-bold">
        {props.title}
      </h1>
      <p className="text-neutral-200 mt-3 text-center">{props.subtitle}</p>
      {props.children}
      <div className="text-center mt-5">
        <SuperButton
          disabled={props.buttonDisabled}
          isLoading={props.isLoading}
          onClick={props.onAction}
          text="Continua"
          classNames="mt-5 max-w-sm text-md font-bold"
        />
      </div>
      {props.withAdminAccess ? (
        <div className="text-center mt-5">
          <Link href="?admin=true" className="font-bold text-white">
            Admin
          </Link>
        </div>
      ) : null}
    </>
  );
};

export default QuestionnaireLayout;

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
  isLoading: boolean;
  onAction: () => void;
  withAdminAccess?: boolean;
};

const QuestionnaireLayout = (props: DashboardLayoutProps) => {
  return (
    <>
      <h1 className="text-4xl text-white text-center font-bold">
        {props.title}
      </h1>
      <p className="text-neutral-400 mt-3 text-center">{props.subtitle}</p>
      {props.children}
      <div className="text-center mt-5">
        <Button
          disabled={props.isLoading}
          className="mt-5 w-full max-w-sm bg-brand hover:bg-brand text-md font-bold"
          onClick={props.onAction}
        >
          {props.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Attendi
            </>
          ) : (
            "Continua"
          )}
        </Button>
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

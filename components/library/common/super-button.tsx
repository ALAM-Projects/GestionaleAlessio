import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type SuperButtonProps = {
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isLoading?: boolean;
  text: string;
  classNames?: string;
};

const SuperButton = (props: SuperButtonProps) => {
  return (
    <Button
      disabled={props.disabled || props.isLoading}
      onClick={(e) => props.onClick(e)}
      className={`bg-brand hover:bg-brand w-full ${props.classNames}`}
    >
      {props.isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Attendi
        </>
      ) : (
        props.text
      )}
    </Button>
  );
};

export default SuperButton;

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type SuperButtonProps = {
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isLoading?: boolean;
  text: string;
  classNames?: string;
  variant?: "outline" | "default" | "brand";
};

const SuperButton = (props: SuperButtonProps) => {
  const { variant = "outline" } = props;
  return (
    <Button
      disabled={props.disabled || props.isLoading}
      onClick={(e) => props.onClick(e)}
      variant={variant}
      className={`w-full ${props.classNames}`}
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

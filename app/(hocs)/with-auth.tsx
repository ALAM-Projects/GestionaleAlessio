import { useEffect, useState } from "react";
import { decryptKey } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthComponent(props: P) {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = () => {
        const encryptedKey = localStorage.getItem("accessKey");

        if (!encryptedKey) {
          setIsAuthorized(false);
          return;
        }

        const accessKey = decryptKey(encryptedKey);
        const isValid =
          accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY?.toString();

        setIsAuthorized(isValid);
      };

      checkAuth();
    }, []);

    if (isAuthorized === null) {
      // Still checking authorization
      return (
        <div className="mx-auto p-10">
          <Spinner size="lg" color="border-primary" />;
        </div>
      );
    }

    if (isAuthorized === false) {
      // Unauthorized
      return (
        <div className="p-10 flex justify-center items-center">
          <Card className="w-[25%] bg-brand border-0">
            <CardHeader>
              <CardTitle className="text-white">Non sei autorizzato</CardTitle>
              <CardDescription>
                Effettua il login come Admin per visualizzare il contenuto di
                questa pagina.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="bg-primary text-white"
                onClick={() => router.push("/onboarding/intro?admin=true")}
              >
                Login
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Authorized
    return <WrappedComponent {...props} />;
  };
}

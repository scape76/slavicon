import { Await, Link } from "@tanstack/react-router";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Route } from "../routes/__root";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { UserMenu } from "./user-menu";
import { authClient } from "@/lib/auth";

interface HeaderProps {
  toggleSidebar?: React.ReactNode;
  className?: string;
}

export function Header({ toggleSidebar, className }: HeaderProps) {
  // const { userPromise } = Route.useLoaderData();
  const { data: session, isPending, error } = authClient.useSession();

  console.log("SESSION ", session);

  const signin = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });

    console.log("data is ", data);
  };

  return (
    <header
      className={cn(
        "flex py-8 sm:py-12 px-4 sm:px-6 items-center justify-between container",
        className
      )}
    >
      {toggleSidebar}
      <Link to="/" className="text-lg sm:text-3xl font-bold">
        Slavicón
      </Link>
      {/* <Avatar>
        <AvatarFallback>
          <Loader2 className="animate-spin" />
        </AvatarFallback>
      </Avatar> */}
      <button
        onClick={signin}
        // href={`${import.meta.env.VITE_API_URL}/auth/google` as any}
        className={cn(
          buttonVariants({
            variant: "link",
            className: "text-sm sm:text-base font-medium text-foreground",
          })
        )}
      >
        Sign in
      </button>
    </header>
  );
}

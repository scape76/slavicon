import { Await, Link, useRouter } from "@tanstack/react-router";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Route } from "../routes/__root";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { UserMenu } from "./user-menu";

interface HeaderProps {
  toggleSidebar?: React.ReactNode;
  className?: string;
}

export function Header({ toggleSidebar, className }: HeaderProps) {
  const { userPromise } = Route.useLoaderData();

  const router = useRouter();

  return (
    <header
      className={cn(
        "flex py-8 sm:py-12 px-4 sm:px-6 items-center justify-between container",
        className
      )}
    >
      <div className="flex items-center gap-2 xl:gap-4">
        {toggleSidebar}
        <Link to="/" className="text-lg sm:text-3xl font-bold">
          Slavicón
        </Link>
      </div>

      <Await
        promise={userPromise}
        fallback={
          <Avatar>
            <AvatarFallback>
              <Loader2 className="animate-spin" />
            </AvatarFallback>
          </Avatar>
        }
      >
        {function (data) {
          if (data?.user) {
            return <UserMenu user={data.user} />;
          }

          return (
            <a
              href={
                `${import.meta.env.VITE_API_URL}/auth/google?from=${router.state.location.href}` as any
              }
              className={cn(
                buttonVariants({
                  variant: "link",
                  className: "text-sm sm:text-base font-medium text-foreground",
                })
              )}
            >
              Sign in
            </a>
          );
        }}
      </Await>
    </header>
  );
}

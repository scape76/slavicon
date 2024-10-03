import { Await, Link } from "@tanstack/react-router";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Route } from "../routes/__root";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { userPromise } = Route.useLoaderData();

  return (
    <header className="flex py-2 sm:py-6 px-4 sm:px-6 items-center justify-between container">
      <Link to="/" className="text-lg sm:text-2xl font-bold">
        WebName
      </Link>
      <Await
        promise={userPromise}
        fallback={<div className="animate-pulse">Loading...</div>}
      >
        {function (data) {
          if (data) {
            return (
              <Avatar>
                <AvatarImage
                  src={data.user.image ?? "/placeholder.svg"}
                  alt={data.user.username ?? ""}
                />
                <AvatarFallback>{data.user.username?.[0]}</AvatarFallback>
              </Avatar>
            );
          }

          return (
            <a
              href={`${import.meta.env.VITE_API_URL}/auth/google` as any}
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

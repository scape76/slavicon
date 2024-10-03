import { Link } from "@tanstack/react-router";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="flex py-2 sm:py-6 px-4 sm:px-6 items-center justify-between container">
      <Link to="/" className="text-lg sm:text-2xl font-bold">
        WebName
      </Link>
      <Link
        to={"/api/auth/google" as any}
        className={cn(
          buttonVariants({
            variant: "link",
            className: "text-sm sm:text-base font-medium text-foreground",
          })
        )}
      >
        Sign in
      </Link>
    </header>
  );
}

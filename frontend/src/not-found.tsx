import { Link } from "@tanstack/react-router";
import { cn } from "./lib/utils";
import { buttonVariants } from "./components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Button } from "./components/ui/button";

export function RootNotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link  to="/" className={cn(buttonVariants({ variant: "outline" }))}>
        <ChevronLeft  className="mr-2 size-4" />
        Go to the home page
      </Link>
    </div>
  );
}

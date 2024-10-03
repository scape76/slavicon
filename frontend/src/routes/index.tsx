import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <main className="container h-[screen] flex-1 grid gap-5">
      <div className="ml-auto w-3/4 h-full flex flex-col justify-center">
        <h1 className="text-[90px] font-medium uppercase float-right text-right">
          The biggest encyclopedia of Slavic gods
        </h1>
        <hr className="border-t-2 border-primary w-3/4 ml-auto" />
      </div>
      <div className="flex justify-between items-center">
        <Link
          to="/collection"
          className="text-muted-foreground hover:text-accent-foreground font-bold focus:text-accent-foreground transition-colors duration-300 active:text-accent-foreground  text-xl flex flex-col uppercase"
        >
          <span>Find out</span>
          <span className="flex items-center">
            more <ArrowRight className="size-4 ml-2" />
          </span>
        </Link>
        <p className="text-xl">Read it, Watch it, Chat it</p>
      </div>
    </main>
  );
}

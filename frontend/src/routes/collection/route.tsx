import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/collection")({
  component: () => {
    const router = useRouter();

    return (
      <div
        className={cn("flex flex-col h-dvh", {
          "overflow-hidden": router.state.location.pathname === "/collection",
        })}
      >
        <Header />
        <Outlet />
      </div>
    );
  },
});

import { Header } from "@/components/header";
import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/collection")({
  component: () => (
    <div>
      <Header />
      <Outlet />
    </div>
  ),
});

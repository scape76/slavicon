import { Header } from "@/components/header";
import { LoaderData } from "@/types";
import { Link, Outlet, createRootRoute, defer } from "@tanstack/react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import ky from "ky";
// will need to sync types with backend

const queryClient = new QueryClient();

export const Route = createRootRoute({
  loader: () => {
    const userPromise: Promise<LoaderData> = ky.get("/api/user").json();

    return {
      userPromise: defer(userPromise),
    };
  },
  // never revalidate (basically infinite cache time)
  staleTime: Infinity,
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </QueryClientProvider>
  );
}

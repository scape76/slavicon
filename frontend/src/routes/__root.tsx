import { Header } from "@/components/header";
import { LoaderData } from "@/types";
import { Link, Outlet, createRootRoute, defer } from "@tanstack/react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { api } from "@/lib/api";
// will need to sync types with backend

const queryClient = new QueryClient();

export const Route = createRootRoute({
  loader: () => {
    const userPromise: Promise<LoaderData> = api.get("auth/user").json();

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
      {import.meta.env.DEV && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}

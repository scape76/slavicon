import { Header } from "@/components/header";
import { Link, Outlet, createRootRoute, defer } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import ky from "ky";

// will need to sync types with backend
type LoaderData = {
  session: any;
  user: {
    id: string;
    email: string;
    image: string | null;
    username: string | null;
  };
};

export const Route = createRootRoute({
  loader: () => {
    const userPromise: Promise<LoaderData> = ky.get("/api/user").json();

    return {
      userPromise: defer(userPromise),
    };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}

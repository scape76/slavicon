import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/collection")({
   component: () => {
      const router = useRouter();

      return (
         <div
            className={cn(
               "flex flex-col h-dvh bg-[url('/background/background-gallery.png')] bg-fixed bg-no-repeat bg-cover bg-[-40vw_center] md:bg-[center_center]  xl:bg-cover",
               {
                  "overflow-hidden":
                     router.state.location.pathname === "/collection",
               }
            )}
         >
            <Header />
            <Outlet />
         </div>
      );
   },
});

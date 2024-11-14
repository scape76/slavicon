import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
   SidebarContent,
   Sidebar,
   SidebarHeader,
   SidebarProvider,
   SidebarTrigger,
   SidebarGroup,
   SidebarGroupLabel,
   SidebarGroupContent,
   SidebarMenuItem,
   SidebarMenuButton,
   SidebarMenu,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Result } from "@/types";
import {
   createFileRoute,
   Link,
   Outlet,
   useRouter,
   useRouterState,
} from "@tanstack/react-router";
import { isYesterday } from "date-fns";
import { isToday } from "date-fns";
import ky from "ky";
import { ChevronLeft, MessageSquarePlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
   TooltipProvider,
} from "@/components/ui/tooltip";
import { api } from "@/lib/api";

type Chat = {
   id: string;
   name: string;
   updatedAt: string;
};

export const Route = createFileRoute("/c")({
   loader: async () => {
      const data: Result<Chat[] | null> = await api.get("chats").json();

      return data;
   },

   component: () => <Layout />,
});

function Layout() {
   return (
      <div className="flex-1 flex flex-col bg-[url('/background/background-chat.png')] bg-no-repeat bg-cover bg-[-40vw_center] md:bg-[center_center]  xl:bg-cover">
         <SidebarProvider>
            <ChatsSidebar />
            <main className="relative w-full h-screen flex flex-col">
               <Header
                  toggleSidebar={<HeaderToggleSidebar />}
                  className="sticky top-0 bg-[#04090C80] z-20"
               />
               <Outlet />
            </main>
         </SidebarProvider>
      </div>
   );
}

function HeaderToggleSidebar() {
   const { open, isMobile } = useSidebar();

   if (isMobile) {
      return <SidebarTrigger />;
   }

   return !open ? <SidebarTrigger /> : null;
}

function ChatsSidebar() {
   const { data } = Route.useLoaderData();
   const router = useRouter();

   const routerState = useRouterState();

   const groupedChats = useMemo(() => {
      return data?.reduce(
         (acc, chat) => {
            const updatedAt = new Date(chat.updatedAt ?? "");
            let group = "Previous";
            if (isToday(updatedAt)) {
               group = "Today";
            } else if (isYesterday(updatedAt)) {
               group = "Yesterday";
            }

            if (!acc[group]) {
               acc[group] = [];
            }

            acc[group].push(chat);
            return acc;
         },
         {} as Record<string, Chat[]>
      );
   }, [data]);

   return (
      <Sidebar>
         <SidebarHeader className="flex flex-row justify-between items-center">
            <SidebarTrigger />
            <Button
               size="icon"
               variant="ghost"
               aria-label="Create new chat"
               onClick={() => {
                  router.navigate({
                     to: "/c",
                  });
               }}
            >
               <MessageSquarePlus className="size-5" />
            </Button>
         </SidebarHeader>
         <SidebarContent>
            <ScrollArea className="flex-1 pr-4">
               {groupedChats &&
                  Object.entries(groupedChats).map(([group, chats]) => (
                     <SidebarGroup key={group}>
                        <SidebarGroupLabel className="px-2 text-lg font-semibold">
                           <span className="first-letter:text-primary">
                              {group}
                           </span>
                        </SidebarGroupLabel>
                        <hr className="border-b border-foreground w-2/3 my-1 ml-2" />
                        <SidebarGroupContent className="flex flex-col gap-1 mt-2">
                           <SidebarMenu>
                              {chats.map((chat) => (
                                 <TooltipProvider key={chat.id}>
                                    <Tooltip>
                                       <TooltipTrigger>
                                          <SidebarMenuItem key={chat.id}>
                                             <SidebarMenuButton asChild>
                                                <Link
                                                   to={`/c/${chat.id}`}
                                                   className={cn(
                                                      "w-full p-2 hover:bg-accent/80 rounded-md",
                                                      {
                                                         "bg-accent/80":
                                                            routerState.location
                                                               .pathname ===
                                                            `/c/${chat.id}`,
                                                      }
                                                   )}
                                                >
                                                   <span className="truncate">
                                                      {chat.name}
                                                   </span>
                                                </Link>
                                             </SidebarMenuButton>
                                          </SidebarMenuItem>
                                       </TooltipTrigger>
                                       <TooltipContent className="bg-card text-foreground">
                                          {chat.name}
                                       </TooltipContent>
                                    </Tooltip>
                                 </TooltipProvider>
                              ))}
                           </SidebarMenu>
                        </SidebarGroupContent>
                     </SidebarGroup>
                  ))}
               {data?.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center mt-4">
                     You have no chats yet
                  </div>
               )}
            </ScrollArea>
         </SidebarContent>
      </Sidebar>
   );
}

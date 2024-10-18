import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Result } from '@/types'
import { createFileRoute, Link, Outlet, useRouter, useRouterState } from '@tanstack/react-router'
import { isYesterday } from 'date-fns'
import { isToday } from 'date-fns'
import ky from 'ky'
import { ChevronLeft, MessageSquarePlus } from 'lucide-react'
import { useMemo, useState } from 'react'

type Chat = {
    id: string;
    name: string;
    updatedAt: string;
}
export const Route = createFileRoute('/c')({
  loader: async () => {
    const data: Result<Chat[] | null> = await ky.get('/api/chats').json()

    return data
  },

  component: () => <Layout/>
})

function Layout() {
  return (
    <div className="grid grid-cols-[240px_1fr] flex-1">
      <ChatList />
      <main className="relative w-full h-full flex-1">
        <Outlet />
      </main>
    </div>
  )
}

function ChatList() {
  const { data } = Route.useLoaderData();
  const router = useRouter();

  const routerState = useRouterState()

  const goBack = () => {
    router.history.back();
  };

  const groupedChats = useMemo(() => {
   return data?.reduce((acc, chat) => {
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
  }, {} as Record<string, Chat[]>); 
  }, [data]);

  console.log(routerState.location.pathname)  
  
  return (
    <aside className="flex flex-col border-r border-[#990273] px-4 py-2">
        <div className="flex justify-between items-center">
          <Button
            size="icon"
            variant="ghost"
            aria-label="Go back"
            onClick={goBack}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Create new chat"
            onClick={goBack}
          >
            <MessageSquarePlus className="size-5" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-140px)]">
        {groupedChats && Object.entries(groupedChats).map(([group, chats]) => (
          <div key={group}>
            <h2 className="px-2 text-lg font-semibold first-letter:text-primary">{group}</h2>
            <hr className="border-b border-foreground w-2/3 my-1 ml-2"/>
            <div className="flex flex-col gap-1 mt-2">
              {chats.map((chat) => (
              <Link key={chat.id} to={`/c/${chat.id}`} className={cn("w-full p-2 hover:bg-accent/80 rounded-md", {
                "bg-accent/80": routerState.location.pathname === `/c/${chat.id}`
              })}>
                {chat.name}
              </Link>
            ))}
            </div>
          </div>
        ))}
        {data?.length === 0 && <div className="text-sm text-muted-foreground text-center mt-4">You have no chats yet</div>}
        </ScrollArea>
    </aside>
  )
}

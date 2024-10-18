import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import ky from 'ky'
import { ChevronLeft, Send } from 'lucide-react'

type Message = {
  body: string;
  from: "user" | "assistant";
}

type Chat = {
  id: string
  name: string
  messages: Message[]
}

export const Route = createFileRoute('/c/$chatId')({
  loader: async ({ params: { chatId } }) => {
    const response = await ky.get(`/api/chats/${chatId}`)

    if (response.status === 404) {
      throw notFound({
        data: {
          chatId,
        },
      })
    }

    const { data }: {data: Chat} = await response.json()

    return {
      data
    }
  },
  component: Chat,
  notFoundComponent: ({ data }: any) => {
    return <ChatNotFound chatId={data.data.chatId} />
  },
})

function Chat() {
  return (
    <div className="relative max-w-3xl mx-auto gap-4 h-full">
      <MessageList/>
      <MessageInput/>
    </div>
  )
}

function MessageList() {
  const { data } = Route.useLoaderData()

  return <div className='flex flex-col gap-2'>
    {data.messages.map((message: Message) => (
      <div key={message.body} className={cn("self-start p-4 rounded-lg border border-primary/30", {
        "self-end": message.from === "user",
      })}>
        {message.body}
      </div>
    ))}
  </div>
}

function MessageInput() {
  return <div className='absolute bottom-4 w-full'>
    <div className='relative'>
    <Input placeholder="Message text" size="xl"/>
    <Button size="icon" variant="ghost" className='absolute right-2 top-1.5'><Send className='size-4'/></Button>
    </div>
  </div>
}

function ChatNotFound({ chatId }: { chatId: string }) {
  return (
    <div className="h-[calc(100vh-45px)] flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Chat Not Found</h1>
      <p>The chat with id {chatId} does not exist.</p>
      <Link to="/c" className={cn(buttonVariants({ variant: 'outline' }))}>
        <ChevronLeft className="mr-2 size-4" />
        Go to the chat list
      </Link>
    </div>
  )
}

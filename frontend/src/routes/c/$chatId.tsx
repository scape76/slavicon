import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  createFileRoute,
  defer,
  Link,
  notFound,
  useLoaderData,
  Await,
} from "@tanstack/react-router";
import ky from "ky";
import { ChevronLeft } from "lucide-react";

type Chat = {
  id: string;
  name: string;
};

export const Route = createFileRoute("/c/$chatId")({
  loader: async ({ params: { chatId } }) => {
    const response = await ky.get(`/api/chats/${chatId}`);

    if (response.status === 404) {
      throw notFound({
        data: {
          chatId,
        },
      });
    }

    const chat: Chat = await response.json();

    return {
      chat,
    };
  },
  component: Chat,
  notFoundComponent: ({ data }: any) => {
    return <ChatNotFound chatId={data.data.chatId} />;
  },
});

function Chat() {
  const { chat } = Route.useLoaderData();

  return (
    <div>
      <h1 className="text-4xl font-bold">Chat {chat.name}</h1>
      <Link to="/c" className={cn(buttonVariants({ variant: "outline" }))}>
        <ChevronLeft className="mr-2 size-4" />
        Go to the chat list
      </Link>
    </div>
  );
}

function ChatNotFound({ chatId }: { chatId: string }) {
  return (
    <div className="h-[calc(100vh-45px)] flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Chat Not Found</h1>
      <p>The chat with id {chatId} does not exist.</p>
      <Link to="/c" className={cn(buttonVariants({ variant: "outline" }))}>
        <ChevronLeft className="mr-2 size-4" />
        Go to the chat list
      </Link>
    </div>
  );
}

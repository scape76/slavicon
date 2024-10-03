import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  createFileRoute,
  Link,
  notFound,
  useLoaderData,
} from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/c/$chatId")({
  loader: ({ params: { chatId } }) => {
    if (![1, 2].includes(Number(chatId))) {
      throw notFound({
        data: {
          chatId,
        },
      });
    }

    return {
      chatId,
    };
  },
  component: (params) => {
    const { chatId } = useLoaderData({ from: params.from });

    return <div>This is chat with id {chatId}</div>;
  },
  notFoundComponent: ({ data }: any) => {
    return <ChatNotFound chatId={data.data.chatId} />;
  },
});

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

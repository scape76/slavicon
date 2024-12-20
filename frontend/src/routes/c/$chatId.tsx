import { MessageInput } from "@/components/message-input";
import { MessageList } from "@/components/message-list";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { cn, getGodAvatar } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Send } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

type Message = {
  body: string;
  from: "user" | "assistant";
};

type Chat = {
  id: string;
  name: string;
  messages: Message[];
  godName: string;
};

export const Route = createFileRoute("/c/$chatId")({
  loader: async ({ params: { chatId } }) => {
    try {
      const response = await api.get(`chats/${chatId}`);

      if (response.status === 404) {
        throw notFound();
      }

      const { data }: { data: Chat } = await response.json();

      return {
        data,
      };
    } catch (err) {
      throw notFound();
    }
  },
  component: Chat,
  notFoundComponent: () => {
    return <ChatNotFound />;
  },
});

function Chat() {
  const { data } = Route.useLoaderData();
  const [isTransitioning, startTransition] = useTransition();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [answer, setAnswer] = useState<null | string>(null);
  const [finished, setFinished] = useState(false);

  const { isPending, mutate } = useMutation({
    mutationFn: async (message: string) => {
      const response = await api.post(`chats/${data.id}`, {
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      setFinished(false);

      while (true) {
        const { done, value } = (await reader?.read()) ?? {};
        if (done) break;

        const text = decoder.decode(value ?? new Uint8Array(), {
          stream: true,
        });

        setAnswer((prev) => (prev ? prev + text : text));
      }

      setFinished(true);
    },
  });

  const scrollToBottom = () => {
    setTimeout(() => lastMessageRef.current?.scrollIntoView(), 0);
  };

  scrollToBottom();

  useEffect(() => {
    scrollToBottom();
  }, [messages, answer]);

  const onSend = (message: string) => {
    startTransition(() => {
      const messages: Message[] = [];
      if (answer) messages.push({ body: answer, from: "assistant" });
      messages.push({ body: message, from: "user" });
      setMessages((prev) => [...prev, ...messages]);
      setAnswer(null);
      mutate(message);
    });
  };

  return (
    <div className="mx-4 h-full flex flex-col">
      <div className="relative max-w-5xl mx-auto w-full flex-1 flex flex-col">
        <ScrollArea
          className="flex-1 pr-4"
          viewportClassName="h-full flex flex-col justify-end"
        >
          <div className="pb-9">
            <MessageList
              godInfo={{
                avatar: getGodAvatar(data.godName),
                name: data.godName,
              }}
              messages={[...data.messages, ...messages]}
              latestAnswer={
                answer ? { body: answer, isFinished: finished } : undefined
              }
              lastMessageRef={lastMessageRef}
            />
          </div>
        </ScrollArea>
        <div className="sticky flex flex-col items-center gap-2 bottom-0 bg-background pt-1 pb-2">
          <MessageInput
            onSend={onSend}
            disabled={isTransitioning || isPending}
          />
          <span className="text-xs text-muted-foreground">
            Slavic God can make mistakes :D
          </span>
        </div>
      </div>
    </div>
  );
}

function ChatNotFound() {
  return (
    <div className="h-[calc(100dvh-45px)] flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Chat Not Found</h1>
      <p>The chat you are looking for does not exist.</p>
      <Link
        to="/c"
        search={{
          godName: "veles",
        }}
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        <ChevronLeft className="mr-2 size-4" />
        Go back
      </Link>
    </div>
  );
}

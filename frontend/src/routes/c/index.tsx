import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Result } from "@/types";
import {
  createFileRoute,
  Link,
  redirect,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";
import ky from "ky";
import { ChevronLeft, MessageSquarePlus, Send } from "lucide-react";
import { useState } from "react";

type Chat = {
  id: string;
  name: string;
};

export const Route = createFileRoute("/c/")({
  loader: async () => {
    const data: Result<Chat[] | null> = await ky.get("/api/chats").json();

    return data;
  },

  component: ChatList,
});

function ChatList() {
  const router = useRouter();
  const { data } = Route.useLoaderData();

  const [input, setInput] = useState("");

  const goBack = () => {
    router.history.back();
  };

  const submit = () => {
    const message = input.trim();
    if (!message) return;
    console.log(message);
    setInput("");
  };

  return (
    <div className="grid grid-cols-[240px_1fr] flex-1">
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
        {data?.map((chat) => (
          <Link key={chat.id} to={`/c/${chat.id}`}>
            {chat.name}
          </Link>
        ))}
      </aside>
      <main className="relative w-full h-full flex-1">
        <div className="flex flex-col max-w-xl mx-auto gap-4 h-full items-center justify-center">
          <h1 className="text-lg md:text-3xl">Chat with me</h1>
          <div className="relative w-full">
            <Input
              placeholder="Message Veles"
              size="xl"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (e.shiftKey) {
                    setInput((prev) => prev + "\r\n");
                  } else {
                    e.preventDefault();
                    return submit();
                  }
                }
              }}
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1.5"
            >
              <Send className="size-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

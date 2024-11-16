import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import {
  Await,
  createFileRoute,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import { Loader2, MessageSquarePlus, Send } from "lucide-react";
import { useState } from "react";
import { MessageList } from "@/components/message-list";
import { MessageInput } from "@/components/message-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { Route as IndexRoute } from "../__root";
import { getGodAvatar } from "@/lib/utils";

type Chat = {
  id: string;
  name: string;
  updatedAt: string;
};

export type GodName = "veles" | "perun" | "dazhbog" | "rod";

function isGodName(n: unknown): n is GodName {
  return (
    typeof n === "string" &&
    ["veles", "perun", "dazhbog", "rod"].includes(n.toLowerCase())
  );
}

export const Route = createFileRoute("/c/")({
  validateSearch: (search: Record<string, unknown>): { godName: GodName } => {
    const godName = search?.godName;

    if (!isGodName(godName)) {
      return {
        godName: "veles",
      };
    }

    return {
      godName: godName,
    };
  },
  component: Chat,
});

function Chat() {
  const [userMessage, setUserMessage] = useState<null | string>(null);
  const [finished, setFinished] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState<null | string>(null);

  const { godName } = Route.useSearch();

  const router = useRouter();

  const { isPending, mutate } = useMutation({
    mutationFn: async (message: string) => {
      // const response = await fetch("/api/chats", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   credentials: "include",
      //   body: JSON.stringify({ message, godName: "Veles" }),
      // });

      const response = await api.post("chats", {
        body: JSON.stringify({
          message,
          godName,
        }),
      });

      if (response.status === 403) {
        router.navigate({
          to: import.meta.env.VITE_API_URL + "/auth/google",
        });
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = (await reader?.read()) ?? {};
        if (done) break;

        const text = decoder.decode(value ?? new Uint8Array(), {
          stream: true,
        });

        if (text.startsWith("###CHATID")) {
          return text.slice(9);
        } else {
          setAssistantMessage((prev) => (prev ? prev + text : text));
        }
      }
    },
    onSuccess: async (chatId) => {
      setFinished(true);
      await new Promise((res) => setTimeout(res, 1000));

      router.navigate({
        to: `/c/${chatId}`,
      });
    },
  });

  const sendMessage = (message: string) => {
    setUserMessage(message);
    mutate(message);
  };

  if (userMessage) {
    return (
      <FakeRoom
        message={userMessage}
        finished={finished}
        response={assistantMessage || ""}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full max-w-3xl mx-auto gap-4 h-full items-center justify-center px-6">
      <InputRoom sendMessage={sendMessage} isPending={isPending} />
    </div>
  );
}

function InputRoom({
  sendMessage,
  isPending,
}: {
  sendMessage: (message: string) => void;
  isPending: boolean;
}) {
  const { userPromise } = IndexRoute.useLoaderData();
  const { godName } = Route.useSearch();

  const [input, setInput] = useState("");

  const submit = () => {
    const message = input.trim();
    if (!message) return;
    setInput("");
    sendMessage(message);
  };

  return (
    <>
      <h1 className="text-lg md:text-3xl">Chat with {godName}</h1>
      <div className="relative w-full">
        <Await promise={userPromise}>
          {({ user }) => {
            return (
              <>
                <Input
                  // feels kinda awkward to have autofocus on mobile
                  autoFocus={window.innerWidth >= 1024}
                  placeholder={
                    user ? `Message ${godName}` : `Login to message ${godName}`
                  }
                  disabled={!user}
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
                  variant="ghost"
                  size="smIcon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => submit()}
                  disabled={isPending || !user}
                >
                  {isPending ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Send className="size-5" />
                  )}
                </Button>
              </>
            );
          }}
        </Await>
      </div>
    </>
  );
}

function FakeRoom({
  message,
  response,
  finished,
}: {
  message: string;
  response: string;
  finished: boolean;
}) {
  const { godName } = Route.useSearch();

  return (
    <div className="mx-4 h-full flex flex-col">
      <div className="relative w-full max-w-5xl mx-auto gap-4 h-full flex-1 flex flex-col">
        <ScrollArea
          className="flex-1 pr-4"
          viewportClassName="h-full flex flex-col justify-end"
        >
          <div className="pb-9">
            <MessageList
              godInfo={{
                name: godName,
                avatar: getGodAvatar(godName),
              }}
              messages={[{ body: message, from: "user" }]}
              latestAnswer={{ body: response, isFinished: finished }}
            />
          </div>
        </ScrollArea>
        <div className="sticky flex flex-col items-center gap-2 bottom-0 bg-background pt-1 pb-2">
          <MessageInput onSend={() => {}} disabled={true} />
          <span className="text-xs text-muted-foreground">
            Slavic God is not a reliable source of information! :0
          </span>
        </div>
      </div>
    </div>
  );
}

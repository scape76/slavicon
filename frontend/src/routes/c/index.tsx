import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import ky from "ky";
import { ChevronLeft, Loader2, MessageSquarePlus, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { AssistantBubble } from "@/components/assistant-bubble";
import { MessageList } from "@/components/message-list";
import { MessageInput } from "@/components/message-input";

type Chat = {
  id: string;
  name: string;
  updatedAt: string;
};

export const Route = createFileRoute("/c/")({
  component: Chat,
});

function Chat() {
  const [userMessage, setUserMessage] = useState<null | string>(null);
  const [finished, setFinished] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState<null | string>(null);

  const router = useRouter();

  const { isPending, mutate } = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, godName: "Veles" }),
      });

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
        const body = text.slice(1);
        // we got back llm's response
        if (text.startsWith("r")) {
          setAssistantMessage((prev) => (prev ? prev + body : body));
        } else if (text.startsWith("c")) {
          // we got back the chat id
          return body;
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
    <div className="flex flex-col flex-1 w-full max-w-xl mx-auto gap-4 h-full items-center justify-center">
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
  const [input, setInput] = useState("");

  const submit = () => {
    const message = input.trim();
    if (!message) return;
    setInput("");
    sendMessage(message);
  };

  return (
    <>
      <h1 className="text-lg md:text-3xl">Chat with me</h1>
      <div className="relative w-full">
        <Input
          autoFocus
          placeholder="Message Veles"
          size="xl"
          disabled={false}
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
          size="icon"
          className="absolute right-0 top-0"
          onClick={() => submit()}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Send className="size-5" />
          )}
        </Button>
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
  return (
    <div className="mx-4 h-full">
      <div className="relative max-w-3xl mx-auto gap-4 h-full">
        <MessageList
          messages={[{ body: message, from: "user" }]}
          latestAnswer={{ body: response, isFinished: finished }}
        />
        <MessageInput onSend={() => {}} disabled={true} />
      </div>
    </div>
  );
}

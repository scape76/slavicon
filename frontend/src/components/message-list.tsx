import { cn } from "@/lib/utils";
import { AssistantBubble } from "./assistant-bubble";
import { God } from "@/types";

interface Message {
  body: string;
  from: "user" | "assistant";
}

interface MessageListProps {
  godInfo: Pick<God, "name" | "avatar">;
  messages: Message[];
  latestAnswer?: {
    body: string;
    isFinished: boolean;
  };
  lastMessageRef?: React.RefObject<HTMLDivElement>;
}

export function MessageList({
  godInfo,
  messages,
  latestAnswer,
  lastMessageRef,
}: MessageListProps) {
  return (
    <div className="flex flex-col flex-1 h-full gap-4 pr-4 pt-4">
      {messages.map((message, i) => {
        const isLast = !latestAnswer && i === messages.length - 1;
        if (message.from === "assistant") {
          return (
            <AssistantBubble
              key={message.body}
              className="self-start"
              message={message.body}
              isFinished={true}
              godInfo={godInfo}
              ref={isLast ? lastMessageRef : undefined}
            />
          );
        }

        return (
          <div
            key={message.body}
            ref={isLast ? lastMessageRef : undefined}
            className={cn(
              "self-end p-4 rounded-lg shadow-white-black gradient-border-mask"
            )}
          >
            {message.body}
          </div>
        );
      })}
      {latestAnswer && (
        <AssistantBubble
          className="self-start"
          godInfo={godInfo}
          message={latestAnswer.body}
          isFinished={latestAnswer.isFinished}
          ref={lastMessageRef}
        />
      )}
    </div>
  );
}

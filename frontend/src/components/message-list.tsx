import { cn } from "@/lib/utils";
import { AssistantBubble } from "./assistant-bubble";

interface Message {
   body: string;
   from: "user" | "assistant";
}

interface MessageListProps {
   messages: Message[];
   latestAnswer?: {
      body: string;
      isFinished: boolean;
   };
}

export function MessageList({ messages, latestAnswer }: MessageListProps) {
   return (
      <div className="flex flex-col flex-1 h-full gap-4 pr-4 pt-4">
         {messages.map((message) => {
            if (message.from === "assistant") {
               return (
                  <AssistantBubble
                     key={message.body}
                     className="self-start"
                     message={message.body}
                     isFinished={true}
                  />
               );
            }

            return (
               <div
                  key={message.body}
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
               message={latestAnswer.body}
               isFinished={latestAnswer.isFinished}
            />
         )}
      </div>
   );
}

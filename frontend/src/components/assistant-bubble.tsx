import React from "react";
import { Cat, Circle, FeatherIcon } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface AssistantBubbleProps extends ComponentPropsWithoutRef<"div"> {
  message: string;
  isFinished: boolean;
}

export const AssistantBubble = React.forwardRef<
  HTMLDivElement,
  AssistantBubbleProps
>(function AssistantBubble(
  { message, isFinished = false, className, ...props },
  ref
) {
  return (
    <div ref={ref} className={cn("flex flex-1 gap-4", className)} {...props}>
      <div className="flex-shrink-0 flex flex-col relative items-end">
        <div className="pt-0">
          <div className="size-10 flex items-center justify-center rounded-full border">
            <Cat className="size-5" />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "self-end p-4 rounded-lg bg-[#04090C80] max-w-full md:max-w-[70%] xl:max-w-full border border-[#FC0FC01A]",
          className
        )}
        {...props}
      >
        <ReactMarkdown
          className={"prose dark:prose-invert prose-md text-foreground"}
        >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  );
});

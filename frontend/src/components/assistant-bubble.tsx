import React from "react";
import { Feather } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { God } from "@/types";
import ReactMarkdown from "markdown-to-jsx";

interface AssistantBubbleProps extends ComponentPropsWithoutRef<"div"> {
  godInfo: Pick<God, "name" | "avatar">;
  message: string;
  isFinished: boolean;
}

export const AssistantBubble = React.forwardRef<
  HTMLDivElement,
  AssistantBubbleProps
>(function AssistantBubble(
  { message, godInfo, isFinished = false, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col sm:flex-row flex-1 gap-4", className)}
      {...props}
    >
      <div className="flex-shrink-0 self-start flex flex-col relative items-end">
        <div className="pt-0">
          <div className="size-12 flex items-center justify-center rounded-full border">
            <img src={godInfo.avatar} alt={godInfo.name} />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "self-end p-4 rounded-lg bg-[#04090C80] max-w-full md:max-w-[70%] xl:max-w-full border border-[#FC0FC01A]",
          className,
        )}
        {...props}
      >
        <ReactMarkdown
          className={"prose dark:prose-invert prose-md text-foreground"}
          options={{
            overrides: {
              span: {
                component: ({ children, ...props }) => {
                  return (
                    <span {...props} className={"group"}>
                      {children}
                      {!isFinished && (
                        <Feather className="size-4 text-primary animate-pulse hidden group-[:last-of-type]:inline-block" />
                      )}
                    </span>
                  );
                },
              },
            },
          }}
        >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  );
});

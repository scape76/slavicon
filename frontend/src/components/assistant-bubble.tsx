import { Cat, Circle, FeatherIcon } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface AssistantBubbleProps extends ComponentPropsWithoutRef<"div"> {
  message: string;
  isFinished: boolean;
}

export function AssistantBubble({
  message,
  isFinished = false,
  className,
  ...props
}: AssistantBubbleProps) {
  return (
    <div className={cn("flex flex-1 gap-4", className)} {...props}>
      <div className="flex-shrink-0 flex flex-col relative items-end">
        <div className="pt-0">
          <div className="size-10 flex items-center justify-center rounded-full border">
            <Cat className="size-5" />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "self-end p-4 rounded-lg border border-primary/30",
          className
        )}
        {...props}
      >
        {message}
        {!isFinished && (
          <FeatherIcon className="size-4 text-primary animate-pulse inline-flex ml-1.5" />
        )}
      </div>
    </div>
  );
}

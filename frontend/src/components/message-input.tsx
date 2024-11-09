import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";

interface MessageInputProps {
   onSend: (message: string) => void;
   disabled?: boolean;
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
   const [value, setValue] = useState("");

   const submit = () => {
      const message = value.trim();
      if (!message || disabled) return;
      onSend(message);
      setValue("");
   };

   return (
      <div className="w-full">
         <div className="relative">
            <Input
               autoFocus
               placeholder="Message Veles"
               value={value}
               onChange={(e) => setValue(e.target.value)}
               onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     if (e.shiftKey) {
                        setValue((prev) => prev + "\r\n");
                     } else {
                        e.preventDefault();
                        return submit();
                     }
                  }
               }}
            />
            <Button
               size="icon"
               variant="ghost"
               className="absolute right-1 top-1/2 transform -translate-y-1/2"
               disabled={disabled}
               onClick={submit}
            >
               <Send className="size-4" />
            </Button>
         </div>
      </div>
   );
}

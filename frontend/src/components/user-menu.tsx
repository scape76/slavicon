import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { User } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link, useRouter } from "@tanstack/react-router";
import { ExitIcon } from "@radix-ui/react-icons";
import { Loader2, MessageSquareIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";

export function UserMenu({ user }: { user: User }) {
  const router = useRouter();

  const { mutate: logout, status } = useMutation({
    mutationFn: () => ky.get("/api/auth/logout").json(),
    onSuccess: () => {
      router.invalidate();
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={user.image ?? "/placeholder.svg"}
            alt={user.username ?? ""}
          />
          <AvatarFallback>{user.username?.[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link to="/c">
          <DropdownMenuItem>
            <MessageSquareIcon className="mr-2 size-4" />
            Chats
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>
          {status === "pending" ? (
            <Loader2 className="mr-2 animate-spin" />
          ) : (
            <ExitIcon className="mr-2" />
          )}
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

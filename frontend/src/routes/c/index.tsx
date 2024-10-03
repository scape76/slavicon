import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import ky from "ky";

type Chat = {
  id: string;
  name: string;
};

export const Route = createFileRoute("/c/")({
  loader: async () => {
    const chats: Chat[] = await ky.get("/api/chats").json();

    return { chats };
  },

  component: ChatList,
});

function ChatList() {
  const { chats } = Route.useLoaderData();

  return (
    <div className="flex gap-2">
      {chats.map((chat) => (
        <Link key={chat.id} to={`/c/${chat.id}`}>
          {chat.name}
        </Link>
      ))}
    </div>
  );
}

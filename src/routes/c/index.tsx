import { createFileRoute, Link } from "@tanstack/react-router";

const chats = [
  {
    id: 1,
    name: "Chat 1",
  },
  {
    id: 2,
    name: "Chat 2",
  },
  {
    id: 3,
    name: "Doesn't exist",
  },
];

export const Route = createFileRoute("/c/")({
  component: () => (
    <div>
      Hello /c/!
      <div className="flex gap-2">
        {chats.map((chat) => (
          <Link key={chat.id} to={`/c/${chat.id}`}>
            {chat.name}
          </Link>
        ))}
      </div>
    </div>
  ),
});


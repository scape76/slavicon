import type { User } from "lucia";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { chats, messages } from "../db/schema";

export async function getUserChats(userId: User["id"]) {
  const userChats = await db.query.chats.findMany({
    where: eq(chats.userId, userId),
    columns: {
      id: true,
      name: true,
    },
  });

  return userChats;
}

// returns null if chat author is not the same
export async function getChat(chatId: string, userId: User["id"]) {
  const userChat = await db.query.chats.findFirst({
    where: eq(chats.id, chatId),
  });

  if (userChat?.userId !== userId) {
    return null;
  }

  return userChat;
}

export async function createChat({
  godName,
  userId,
  message,
}: {
  godName: string;
  userId: User["id"];
  message: string;
}) {
  const data = await db.transaction(async (tx) => {
    const chat = await tx.insert(chats).values({
      name: "Untitled",
      userId,
      godName: "",
    });

    const mesage = await tx.insert(messages);
  });
}

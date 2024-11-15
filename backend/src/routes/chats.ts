import {
  createChat,
  getChat,
  getUserChats,
  saveMessage,
  updateChatName,
} from "../use-cases/chats";
import { stream, streamText, streamSSE } from "hono/streaming";
import { ask, generateChatName } from "../use-cases/openai";
import { validateSession } from "../use-cases/auth";
import { Hono } from "hono";

const chatsRouter = new Hono();

chatsRouter.get("/", async (c) => {
  const result = await validateSession(c);

  if (!result?.user) {
    return c.json({ data: [] }, 200);
  }

  const chats = await getUserChats(result.user.id);
  return c.json({ data: chats }, 200);
});

chatsRouter.get("/:id", async (c) => {
  const result = await validateSession(c);

  if (!result?.user) {
    return c.notFound();
  }

  const chat = await getChat(c.req.param("id"), result.user.id);

  if (!chat) {
    return c.notFound();
  }

  return c.json({ data: chat }, 200);
});

chatsRouter.post("/", async (c) => {
  const result = await validateSession(c);

  if (!result?.user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { message, godName } = await c.req.json();

  if (!message) {
    return c.json({ error: "Message is required" }, 400);
  }

  return streamText(c, async (stream) => {
    const data = await createChat({
      godName,
      userId: result.user.id,
      message,
    });

    const chatId = data.chat.id;

    const streamData = await ask(message);
    const reader = streamData?.getReader();

    if (!reader) {
      return;
    }

    const decoder = new TextDecoder();

    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();

      if (done || !value) break;

      const json = decoder.decode(value, { stream: true });

      for (const line of json.split("\n")) {
        if (line.trim() === "") continue;

        console.log("line is ", line);
        const body = JSON.parse(line);

        const text = body.message.content;

        buffer += text;

        await stream.write("r" + text);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    await saveMessage(chatId, buffer, "assistant");

    const chatName = await generateChatName({
      question: message,
      answer: buffer,
    });

    await updateChatName(chatId, chatName ?? "Untitled");

    await stream.write("c" + chatId);

    await stream.close();
  });
});

chatsRouter.post("/:id", async (c) => {
  const result = await validateSession(c);

  if (!result?.user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { message } = await c.req.json();

  if (!message) {
    return c.json({ error: "Message is required" }, 400);
  }

  const chatId = c.req.param("id");

  const chat = await getChat(chatId, result.user.id);

  if (!chat) {
    return c.notFound();
  }

  await saveMessage(chatId, message, "user");

  return streamText(c, async (stream) => {
    const streamData = await ask(message, chat.messages);
    const reader = streamData?.getReader();

    if (!reader) {
      return;
    }

    const decoder = new TextDecoder();

    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const json = decoder.decode(value ?? new Uint8Array(), { stream: true });

      for (const line of json.split("\n")) {
        if (line.trim() === "") continue;

        const body = JSON.parse(line);

        const text = body.message.content;
        buffer += text;

        await stream.write(text);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    await saveMessage(chatId, buffer, "assistant");

    await stream.close();
  });
});

export { chatsRouter };

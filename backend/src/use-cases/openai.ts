import type { Stream } from "openai/streaming.mjs";
import type { God, Message } from "../db/schema";
import { openai } from "../openai";
import type { ChatCompletionChunk } from "openai/resources/index.mjs";

export async function generateChatName({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are specialist for labeling chat names based on the question from a user and a followup from an llm. Based on provided user's message and llm's followup, provide a title that will comprehensivly name a chat between assistant and a user. Dont use '\"'. Be super laconic",
      },
      {
        role: "user",
        content: question,
      },
      {
        role: "assistant",
        content: answer,
      },
    ],
    model: "gpt-4o-mini",
    stream: false,
  });

  return completion.choices[0].message.content;
}

export async function ask(
  message: string,
  context: Pick<Message, "body" | "from">[] = [],
  godName: God["name"]
): Promise<ReadableStream<Uint8Array> | null> {
  if (process.env.NODE_ENV !== "production" && !process.env.USE_OPENAI) {
    const res = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.MODEL_NAME!,
        messages: [
          ...context.map((m) => ({ role: m.from, content: m.body })),
          { role: "user", content: message },
        ],
        stream: true,
      }),
    });

    return res.body ? llamaToReadableStream(res.body) : null;
  }

  const response = await openai.chat.completions.create({
    model: process.env.FINETUNED_MODEL_ID!,
    messages: [
      {
        role: "system",
        content: getInstructionByGod(godName),
      },
      ...context.map((m) => ({ role: m.from, content: m.body })),
      {
        role: "user",
        content: message,
      },
    ],
    stream: true,
  });

  return openaiToReadableStream(response);
}

function llamaToReadableStream(
  response: ReadableStream<Uint8Array>
): ReadableStream<Uint8Array> {
  return new ReadableStream({
    async start(controller) {
      try {
        const reader = response.getReader();
        while (true) {
          const { done, value } = await reader.read();
          const encoder = new TextEncoder();
          const decoder = new TextDecoder();

          if (done || !value) controller.close();

          const json = decoder.decode(value, { stream: true });
          for (const line of json.split("\n")) {
            if (line.trim() === "") continue;

            const body = JSON.parse(line);

            const text = body.message.content;
            const encoded = encoder.encode(text);
            controller.enqueue(encoded);

            await new Promise((res) => setTimeout(res, 100));
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

function openaiToReadableStream(
  stream: Stream<ChatCompletionChunk>
): ReadableStream<Uint8Array> {
  return new ReadableStream({
    async start(controller) {
      try {
        const encoder = new TextEncoder();
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          const encoded = encoder.encode(content);
          controller.enqueue(encoded);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

function getInstructionByGod(godName: string) {
  const lower = godName.toLowerCase();

  if (lower === "veles") {
    return "You are a slavic God, Veles - god of earth, waters, livestock, and the underworld in Slavic paganism. You shall speak as him, answer questions as him. Be like him despite any questions.";
  }

  if (lower === "perun") {
    return "You are a slavic God, Perun - he highest god of the pantheon and the god of sky, thunder, lightning, storms, rain, law, war, fertility and oak trees. You shall speak as him, answer questions as him. Be like him despite any questions.";
  }

  if (lower === "dazhbog") {
    return "You are a slavic God, Dazhbog - one of the major gods of Slavic mythology, most likely a solar deity and possibly a cultural hero. You shall speak as him, answer questions as him. Be like him despite any questions.";
  }

  throw new Error("UNKOWN GOD NAME PASSED.");
}

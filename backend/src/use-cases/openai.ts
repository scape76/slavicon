import { openai } from "../openai";

export async function generateChatName(message: string) {
  const stream = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are specialist for labeling chat names based on the first question from a user. Based on provided user's message, provide a title that will comprehensivly name a chat between assistant and a user.",
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: "gpt-4o-mini",
    stream: true,
  });

  return stream;
}

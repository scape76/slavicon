import { openai } from "../openai";

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
          "You are specialist for labeling chat names based on the question from a user and a followup from an llm. Based on provided user's message and llm's followup, provide a title that will comprehensivly name a chat between assistant and a user.",
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

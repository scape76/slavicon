import { Hono, type Context } from "hono";
import {
  generateCodeVerifier,
  generateState,
  OAuth2RequestError,
} from "arctic";
import { google, lucia } from "./lucia";
import { parseCookies, serializeCookie } from "oslo/cookie";
import { db } from "./db";
import { users, type Message } from "./db/schema";
import { generateIdFromEntropySize } from "lucia";
import { eq } from "drizzle-orm";
import {
  createChat,
  getChat,
  getUserChats,
  saveMessage,
  updateChatName,
} from "./use-cases/chats";
import { getCookie, setCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { stream, streamText, streamSSE } from "hono/streaming";
import { csrf } from "hono/csrf";
import { generateChatName } from "./use-cases/openai";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use("*", csrf());

app.get("/chats", async (c) => {
  const result = await validateSession(c);

  if (!result?.user) {
    return c.json({ data: [] }, 200);
  }

  const chats = await getUserChats(result.user.id);
  return c.json({ data: chats }, 200);
});

app.get("/chats/:id", async (c) => {
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

app.post("/chats", async (c) => {
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

      if (done) break;

      const json = decoder.decode(value ?? new Uint8Array(), { stream: true });
      for (const line of json.split("\n")) {
        if (line.trim() === "") continue;

        const body = JSON.parse(line);

        const text = body.message.content;

        buffer += text;

        await stream.write("r" + text);
        await new Promise((resolve) => setTimeout(resolve, 100));
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
app.post("/chats/:id", async (c) => {
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

app.get("/user", async (c) => {
  const result = await validateSession(c);

  if (!result) {
    return c.json({ user: null }, 200);
  }

  if (result.session && result.session.fresh) {
    const sessionCookie = lucia.createSessionCookie(result.session.id);

    setCookie(c, lucia.sessionCookieName, sessionCookie.serialize());
  } else if (!result.session) {
    setCookie(
      c,
      lucia.sessionCookieName,
      lucia.createBlankSessionCookie().serialize()
    );
  }

  return c.json(result, 200);
});

app.get("/auth/google", async (c) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["email", "profile"],
  });

  setCookie(c, "google_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  setCookie(c, "code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return c.redirect(url.toString());
});

app.get("/auth/google/callback", async (c) => {
  const stateCookie = getCookie(c, "google_oauth_state") ?? null;
  const codeVerifierCookie = getCookie(c, "code_verifier") ?? null;

  const url = new URL(c.req.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  if (
    !state ||
    !stateCookie ||
    !code ||
    stateCookie !== state ||
    !codeVerifierCookie
  ) {
    return c.json(null, 400);
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      codeVerifierCookie
    );
    const userInfoResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
    );
    const user = await userInfoResponse.json();

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      c.header("Set-Cookie", sessionCookie.serialize(), {
        append: true,
      });

      return c.redirect(process.env.BASE_FRONTEND_URL!);
    }

    const userId = generateIdFromEntropySize(10);
    await db.insert(users).values({
      id: userId,
      email: user.email,
      name: user.name,
      image: user.picture,
      emailVerified: user.email_verified,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    c.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    });

    return c.redirect(process.env.BASE_FRONTEND_URL!, 302);
  } catch (e) {
    return c.json(null, e instanceof OAuth2RequestError ? 400 : 500);
  }
});

app.post("/logout", async (c) => {
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

  if (!sessionId) {
    return c.json(null, 401);
  }

  await lucia.invalidateSession(sessionId);
  const sessionCookie = lucia.createBlankSessionCookie();
  setCookie(c, lucia.sessionCookieName, sessionCookie.serialize());
  return c.json(null, 200);
});

async function validateSession(c: Context) {
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

  if (!sessionId) {
    return null;
  }

  const result = await lucia.validateSession(sessionId);
  return result;
}

async function ask(
  message: string,
  context: Pick<Message, "body" | "from">[] = []
): Promise<ReadableStream<Uint8Array> | null> {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2:3b",
      messages: [
        ...context.map((m) => ({ role: m.from, content: m.body })),
        { role: "user", content: message },
      ],
      stream: true,
    }),
  });

  return res.body;
}

export default app;

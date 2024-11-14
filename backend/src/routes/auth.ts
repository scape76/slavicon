import { Hono } from "hono";
import {
  generateCodeVerifier,
  generateState,
  OAuth2RequestError,
} from "arctic";
import { google, lucia } from "../lucia";
import { db } from "../db";
import { users } from "../db/schema";
import { generateIdFromEntropySize } from "lucia";
import { eq } from "drizzle-orm";
import { getCookie, setCookie } from "hono/cookie";
import { validateSession } from "../use-cases/auth";

const authRouter = new Hono();

authRouter.get("/user", async (c) => {
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

authRouter.get("/google", async (c) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, [
    "email",
    "profile",
  ]);

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

authRouter.get("/google/callback", async (c) => {
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
      { headers: { Authorization: `Bearer ${tokens.accessToken()}` } }
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
      // setCookie(c, lucia.sessionCookieName, sessionCookie.value);
      // console.log("setting to ", sessionCookie.value)

      return c.redirect(process.env.BASE_FRONTEND_URL!, 302);
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

    /*     c.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    }); */
    setCookie(c, lucia.sessionCookieName, sessionCookie.value);

    return c.redirect(process.env.BASE_FRONTEND_URL!, 302);
  } catch (e) {
    return c.json(null, e instanceof OAuth2RequestError ? 400 : 500);
  }
});

authRouter.get("/logout", async (c) => {
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

  if (!sessionId) {
    return c.json(null, 401);
  }

  await lucia.invalidateSession(sessionId);
  const sessionCookie = lucia.createBlankSessionCookie();
  setCookie(c, lucia.sessionCookieName, sessionCookie.serialize());

  return c.json(null, 200);
});

export { authRouter };

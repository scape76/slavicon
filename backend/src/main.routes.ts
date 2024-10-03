import { routes } from "@stricjs/app";
import { text, json } from "@stricjs/app/send";
import { CORS } from "@stricjs/utils";
import {
  generateCodeVerifier,
  generateState,
  OAuth2RequestError,
} from "arctic";
import { google, lucia } from "./lucia";
import { parseCookies, serializeCookie } from "oslo/cookie";
import { db } from "./db";
import { users } from "./db/schema";
import { generateIdFromEntropySize } from "lucia";
import { eq } from "drizzle-orm";

const cors = new CORS({
  allowMethods: ["GET", "POST", "PUT", "DELETE"],
  allowCredentials: true,
  allowOrigins: ["http://localhost:3000"],
  appendHeaders: true,
});

export default routes()
  .use(cors)
  .get("/chats", () => {
    const chats = [
      {
        id: "1",
        name: "Chat 1",
      },
      {
        id: "2",
        name: "Chat 2",
      },
    ];

    return json(chats);
  })
  .get("/chats/:id", (ctx) => {
    if (Number(ctx.params.id) > 2) {
      return new Response(null, { status: 404 });
    }

    return json({
      name: `Chat ${ctx.params.id}`,
      id: ctx.params.id,
    });
  })
  .get("/user", async (ctx) => {
    const cookies = parseCookies(ctx.req.headers.get("Cookie") ?? "");
    const sessionId = cookies.get(lucia.sessionCookieName) ?? null;

    if (!sessionId) {
      // return success but just no session
      return new Response(null, { status: 200 });
    }

    const result = await lucia.validateSession(sessionId);

    const response = new Response(JSON.stringify(result), { status: 200 });

    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);

      response.headers.append("Set-Cookie", sessionCookie.serialize());
    }

    if (!result.session) {
      response.headers.append(
        "Set-Cookie",
        lucia.createBlankSessionCookie().serialize()
      );
    }

    return response;
  })
  .get("/auth/google", async (ctx) => {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const url = await google.createAuthorizationURL(state, codeVerifier, {
      scopes: ["email", "profile"],
    });

    const response = new Response(null, {
      status: 302,
    });

    response.headers.append(
      "Set-Cookie",
      serializeCookie("google_oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
      })
    );

    response.headers.append(
      "Set-Cookie",
      serializeCookie("code_verifier", codeVerifier, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        path: "/",
        sameSite: "lax",
      })
    );

    response.headers.append("Location", url.toString());

    return response;
  })
  .get("/auth/google/callback", async (ctx) => {
    const cookieHeader = ctx.req.headers.get("Cookie") ?? "";
    const cookies = parseCookies(cookieHeader);

    const stateCookie = cookies.get("google_oauth_state") ?? null;
    const codeVerifierCookie = cookies.get("code_verifier") ?? null;

    const url = new URL(ctx.req.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    // verify state
    if (
      !state ||
      !stateCookie ||
      !code ||
      stateCookie !== state ||
      !codeVerifierCookie
    ) {
      console.log("INVALID STATE!!!!!");

      return new Response(null, { status: 400 });
    }

    try {
      const tokens = await google.validateAuthorizationCode(
        code,
        codeVerifierCookie
      );

      const response = await fetch(
        "https://openidconnect.googleapis.com/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      const user = await response.json();

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, user.email),
      });

      if (existingUser) {
        const session = await lucia.createSession(existingUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        return new Response(null, {
          status: 302,
          headers: {
            Location: process.env.BASE_FRONTEND_URL!,
            "Set-Cookie": sessionCookie.serialize(),
          },
        });
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

      return new Response(null, {
        status: 302,
        headers: {
          Location: process.env.BASE_FRONTEND_URL!,
          "Set-Cookie": sessionCookie.serialize(),
        },
      });
    } catch (e) {
      console.log("ERROR", e);

      if (e instanceof OAuth2RequestError) {
        return new Response(null, { status: 400 });
      }
      return new Response(null, { status: 500 });
    }
  })
  .post("/logout", async (ctx) => {
    const cookies = parseCookies(ctx.req.headers.get("Cookie") ?? "");
    const sessionId = cookies.get(lucia.sessionCookieName) ?? null;

    if (!sessionId) {
      return new Response(null, { status: 401 });
    }

    await lucia.invalidateSession(sessionId);
    const sessionCookie = lucia.createBlankSessionCookie();

    return new Response(null, {
      status: 200,
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  });

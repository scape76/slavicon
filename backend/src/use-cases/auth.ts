import type { Context } from "hono";

import { lucia } from "../lucia";
import { getCookie } from "hono/cookie";

export async function validateSession(c: Context) {
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

  if (!sessionId) {
    return null;
  }

  const result = await lucia.validateSession(sessionId);
  return result;
}

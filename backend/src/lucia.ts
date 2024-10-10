import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./db";
import { sessions, users, type User } from "./db/schema";
import { Google } from "arctic";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const GOOGLE_AUTH_CALLBACK_URL = `${process.env.BASE_URL}/auth/google/callback`;

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      image: attributes.image,
      email: attributes.email,
      username: attributes.name,
    };
  },
});

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  GOOGLE_AUTH_CALLBACK_URL
);

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
    // DatabaseSessionAttributes: Session;
  }
}

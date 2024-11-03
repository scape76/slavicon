import {
  pgEnum,
  text,
  uuid,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { createTable } from "../helpers";
import { relations, sql } from "drizzle-orm";

export const users = createTable("user", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: varchar("image", { length: 255 }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const sessions = createTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

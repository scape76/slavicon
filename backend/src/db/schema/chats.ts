import { sql } from "drizzle-orm";
import { pgEnum, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createTable } from "../helpers";

export const messageAuthor = pgEnum("message_author", ["assistant", "user"]);

export const chats = createTable("chat", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  godName: text("god_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "string",
  })
    .default(sql`current_timestamp`)
    .$onUpdate(() => sql`current_timestamp`),
});

export const messages = createTable("message", {
  id: uuid("id").defaultRandom().primaryKey(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  from: messageAuthor("from").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export const chatsRelations = relations(chats, ({ one, many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

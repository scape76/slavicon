import { pgEnum, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "./helpers";
import { relations } from "drizzle-orm";

export const messageAuthor = pgEnum("message_author", ["assistant", "user"]);

export const gods = createTable("god", {
  name: text("name").primaryKey(),
  description: text("description"),
});

export const chats = createTable("chat", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  godName: text("god_name").references(() => gods.name),
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

export const chatsRelations = relations(chats, ({ one, many }) => ({
  god: one(gods, {
    fields: [chats.godName],
    references: [gods.name],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

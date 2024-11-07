import { json, text, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../helpers";

type GodInfo = Record<any, Record<any, any>>;

export const gods = createTable("god", {
  name: varchar("name", { length: 255 }).notNull().primaryKey(),
  knownAs: text("known_as").notNull(),
  // markdown
  description: text("description").notNull(),
  information: json("information").$type<GodInfo>().notNull(),
  image: text("image").notNull(),
  // markdown
  places: text("places").notNull(),
});

export type God = typeof gods.$inferSelect;
export type NewGod = typeof gods.$inferInsert;

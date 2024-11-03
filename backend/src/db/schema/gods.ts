import { text, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../helpers";

export const gods = createTable("god", {
  name: varchar("name", { length: 255 }).notNull().primaryKey(),
  knownAs: text("known_as").notNull(),
  description: text("description"),
  image: text("image").notNull(),
});

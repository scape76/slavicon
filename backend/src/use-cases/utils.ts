import { db } from "../db";
import { PgTransaction } from "drizzle-orm/pg-core";

export function withTransaction<T>(fn: (tx: PgTransaction<any, any, any>) => Promise<T>) {
  return db.transaction(fn);
}

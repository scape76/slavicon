import { db } from "../src/db";
import { gods } from "../src/db/schema";
import cozyGods from "./gods.json";

export const seed = async () => {
  const result = await db.insert(gods).values(cozyGods);
  return result.rowCount;
};

seed()
  .then((count) => {
    console.log(`Seed completed! ${count} gods inserted.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed!");
    console.error(err);
    process.exit(1);
  });

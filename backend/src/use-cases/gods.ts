import { sql } from "drizzle-orm";
import { db } from "../db";
import { gods, type God } from "../db/schema";

export async function getGod(name: God["name"]) {
  const result = await db
    .execute(
      sql`
    WITH ordered_gods AS (
      SELECT name,
             COALESCE(
               LAG(name) OVER (ORDER BY LOWER(name)),
               (SELECT name FROM ${gods} ORDER BY LOWER(name) DESC LIMIT 1)
             ) as prev_name,
             COALESCE(
               LEAD(name) OVER (ORDER BY LOWER(name)),
               (SELECT name FROM ${gods} ORDER BY LOWER(name) ASC LIMIT 1)
             ) as next_name
      FROM ${gods}
    )
    SELECT
      g.* as current_god,
      og.prev_name,
      og.next_name
    FROM ordered_gods og
    LEFT JOIN ${gods} g ON LOWER(g.name) = LOWER(${name})
    WHERE LOWER(og.name) = LOWER(${name})
  `
    )
    .then(({ rows }) => {
      const res = rows[0];
      if (!res) return res;

      return {
        name: res.name,
        description: res.description,
        image: res.image,
        knownAs: res.known_as,
        prevName: res.prev_name,
        nextName: res.next_name,
        information: res.information,
        places: res.places,
      };
    });

  return result;
}

export async function getGodsCollection() {
  const result = await db.query.gods.findMany({
    columns: {
      image: true,
      name: true,
      knownAs: true,
    },
  });

  return result;
}

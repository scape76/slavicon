import { Hono } from "hono";
import { getGod, getGodsCollection } from "../use-cases/gods";

const godsRouter = new Hono();

godsRouter.get("/collection", async (c) => {
  const gods = await getGodsCollection();

  return c.json({ data: gods }, 200);
});

godsRouter.get("/:name", async (c) => {
  const name = c.req.param("name");

  const god = await getGod(name);

  if (!god) return c.notFound();

  return c.json({ data: god }, 200);
});

export { godsRouter };

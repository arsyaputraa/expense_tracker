import { Hono } from "hono";

export const otherRoutes = new Hono().get("/", async (c) => {
  return c.json({ message: "other api" });
});

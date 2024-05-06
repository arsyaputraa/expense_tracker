import { Hono } from "hono";

import { logger } from "hono/logger";

import { routes } from "./routes";
import { serveStatic } from "hono/bun";
const app = new Hono();

app.use(logger());

app.route("/api", routes);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
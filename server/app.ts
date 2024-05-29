import { Hono } from "hono";

import { logger } from "hono/logger";

import { serveStatic } from "hono/bun";
import { routes } from "./routes";
import { validateRequest } from "./middlewares/auth";
const app = new Hono();

app.use("*", logger());
// app.use("/api/user/*", validateRequest);

const apiRoutes = app.route("/api", routes);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export type ApiRoutes = typeof apiRoutes;
export default app;

import { Hono } from "hono";
import { expensesRoute } from "./expenses";

export const routes = new Hono();

routes.route("/expenses", expensesRoute);

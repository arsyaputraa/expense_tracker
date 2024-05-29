import { Hono } from "hono";
import { expensesRoute } from "./expenses";
import { otherRoutes } from "./other";
import { authRoutes } from "./auth";
import { userRoutes } from "./user";

export const routes = new Hono()
  .route("/expenses", expensesRoute)
  .route("/user", userRoutes)
  .route("/auth", authRoutes)
  .route("/other", otherRoutes);

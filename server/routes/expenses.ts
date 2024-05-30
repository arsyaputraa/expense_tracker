import { Hono } from "hono";
import { z } from "zod";
import { createExpenseSchema, type Expense } from "../schema/expenses";
import { getZodSafeParseError } from "../../utils/helper";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { expenseTable } from "../db/schema";
import { validateRequest } from "../middlewares/auth";
import { and, eq, sum } from "drizzle-orm";

const expensesRoute = new Hono()
  .use(validateRequest)
  .get("/", validateRequest, async (c) => {
    try {
      const user = c.var.user;
      const expenses = await db
        .select()
        .from(expenseTable)
        .where(eq(expenseTable.userId, user.id));
      return c.json({ data: expenses, error: null });
    } catch (e) {
      return c.json(
        {
          data: null,
          error: { message: "Internal server error" },
        },
        500
      );
    }
  })
  .post("/", zValidator("json", createExpenseSchema), async (c) => {
    try {
      const user = c.var.user;
      const newExpense = c.req.valid("json");

      const result = await db.insert(expenseTable).values({
        ...newExpense,
        amount: newExpense.amount.toString(),
        userId: user.id as number,
      });

      c.status(201);

      return c.json({ data: result[0], error: null });
    } catch (e) {
      console.error(e);
      return c.json(
        { data: null, error: { message: "Internal server error" } },
        500
      );
    }
  })
  .get("/:id{[0-9]+}", async (c) => {
    try {
      const user = c.var.user;
      const id = Number.parseInt(c.req.param("id"));
      const expense = await db
        .select()
        .from(expenseTable)
        .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)));

      if (!expense[0]) return c.notFound();

      return c.json({ data: expense[0], error: null });
    } catch (e) {
      console.error(e);
      return c.json(
        { data: null, error: { message: "Internal server error" } },
        500
      );
    }
  })
  .delete("/:id{[0-9]+}", async (c) => {
    try {
      const user = c.var.user;
      const id = Number.parseInt(c.req.param("id"));

      const deletedExpense = await db
        .delete(expenseTable)
        .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
        .returning();

      return c.json({ data: deletedExpense[0], error: null });
    } catch (e) {
      console.error(e);
      return c.json(
        { data: null, error: { message: "Internal server error" } },
        500
      );
    }
  })
  .get("/total-spent", async (c) => {
    try {
      const user = c.var.user;
      const result = await db
        .select({ total: sum(expenseTable.amount) })
        .from(expenseTable)
        .where(eq(expenseTable.userId, user.id))
        .limit(1)
        .then((res) => res[0]);
      return c.json({ data: result, error: null }, 200);
    } catch (e) {
      console.error(e);
      return c.json(
        { data: null, error: { message: "Internal server error" } },
        500
      );
    }
  });

export { expensesRoute };

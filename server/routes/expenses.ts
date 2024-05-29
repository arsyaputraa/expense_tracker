import { Hono } from "hono";
import { z } from "zod";
import { createExpenseSchema, type Expense } from "../../schema/expenses";
import { getZodSafeParseError } from "../../utils/helper";
import { zValidator } from "@hono/zod-validator";

const fakeExpenses: Expense[] = [
  { id: 1, title: "Coffee", amount: 4 },
  { id: 2, title: "Lunch", amount: 12 },
  { id: 3, title: "Bus Ticket", amount: 2 },
  { id: 4, title: "Book", amount: 15 },
  { id: 5, title: "Groceries", amount: 35 },
];

const expensesRoute = new Hono()
  .get("/", async (c) => {
    return c.json({ data: fakeExpenses, error: null });
  })
  .post("/", zValidator("json", createExpenseSchema), async (c) => {
    const expense = c.req.valid("json");

    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
    c.status(201);

    return c.json({ data: expense, error: null });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find((item) => item.id === id);

    if (!expense) return c.notFound();

    return c.json({ data: expense, error: null });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const index = fakeExpenses.findIndex((item) => item.id === id);

    if (index === -1) return c.notFound();

    const deletedExpense = fakeExpenses.splice(index, 1)[0];

    return c.json({ data: deletedExpense, error: null });
  })
  .get("/total-spent", (c) => {
    const total = fakeExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    return c.json({ data: { total }, error: null });
  });

export { expensesRoute };

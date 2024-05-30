import { index, numeric, pgTable, serial, text } from "drizzle-orm/pg-core";
import { userTable } from "./userSchema";

export const expenseTable = pgTable(
  "expense",
  {
    id: serial("id").primaryKey(),
    userId: serial("user_id")
      .references(() => userTable.id)
      .notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
  },
  (expense) => {
    return { userIdIndex: index("user_id").on(expense.userId) };
  } // this line is use because we know we will access the data mostly by user id not the id itself
);

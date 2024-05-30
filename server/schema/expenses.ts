import { z } from "zod";

export const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Maximum of 100 characters" }),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Amount must be a valid monetary value",
    }),
});

export const createExpenseSchema = expenseSchema.omit({ id: true });

export type Expense = z.infer<typeof expenseSchema>;

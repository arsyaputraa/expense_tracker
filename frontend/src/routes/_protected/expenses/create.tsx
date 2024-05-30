import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FieldApi, useForm } from "@tanstack/react-form";
import { ChangeEvent } from "react";
import { api } from "@/lib/api";

import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { createExpenseSchema } from "@server/schema/expenses";

export const Route = createFileRoute("/_protected/expenses/create")({
  component: CreateExpense,
});

function CreateExpense() {
  const navigate = useNavigate();
  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      title: "",
      amount: "0",
    },
    onSubmit: async ({ value }) => {
      const res = await api.expenses.$post({ json: value });
      if (!res.ok) throw new Error("server error");
      navigate({ to: "/expenses" });
    },
  });
  return (
    <div className="p-2 w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="mb-4 text-xl font-semibold">Create Expense</h1>
        <div className="grid w-full items-center gap-1.5 mb-2">
          <form.Field
            name="title"
            validators={{
              onChange: createExpenseSchema.shape.title,
              onChangeAsyncDebounceMs: 500,
            }}
            children={(field) => (
              <>
                <Label htmlFor={field.name}>title</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <div className="grid w-full items-center gap-1.5 mb-2">
          <form.Field
            name="amount"
            validators={{
              onChange: createExpenseSchema.shape.amount,
              onChangeAsyncDebounceMs: 500,
            }}
            children={(field) => (
              <>
                <Label htmlFor={field.name}>amount</Label>
                <Input
                  type="number"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <>
              <Button className="mr-2" type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Submit"}
              </Button>
              <button
                type="reset"
                disabled={!canSubmit}
                onClick={() => form.reset()}
              >
                Reset
              </button>
            </>
          )}
        />
      </form>
    </div>
  );
}

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.touchedErrors ? (
        <em className="text-red-300">{field.state.meta.touchedErrors}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

import { getExpenses } from "@/api/expenses/query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_protected/expenses/")({
  component: Expenses,
});

function Expenses() {
  const { isPending, data, error } = useQuery({
    queryKey: ["get-expenses"],
    queryFn: getExpenses,
  });

  if (error || data?.error) return "an error occured : " + error?.message;

  return (
    <div className=" flex min-h-screen justify-center w-full my-5">
      <Table className="max-w-4xl mx-auto">
        <TableCaption>A list of your expense.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Invoice</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ? Array(3)
                .fill(0)
                .map(() => (
                  <TableRow>
                    <TableCell>
                      <Skeleton className="w-full h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-4" />
                    </TableCell>
                  </TableRow>
                ))
            : data.data.map((expense, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.title}</TableCell>

                  <TableCell className="text-right">{expense.amount}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

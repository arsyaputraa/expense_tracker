import { api } from "@/lib/api";

export const getTotalSpent = async () => {
  const res = await api.expenses["total-spent"].$get();

  if (!res.ok) throw new Error("server error");
  const data = await res.json();
  return data;
};

export const getExpenses = async () => {
  const res = await api.expenses.$get();

  if (!res.ok) throw new Error("server error");
  const data = await res.json();
  return data;
};

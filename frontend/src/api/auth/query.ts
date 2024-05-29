import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export const validateAuth = async () => {
  const res = await api.user.me.$get();

  const data = await res.json();

  return data;
};

export const userQueryOptions = queryOptions({
  queryKey: ["validate-current-user"],
  queryFn: validateAuth,
  staleTime: Infinity,
});

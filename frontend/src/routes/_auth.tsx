import { userQueryOptions, validateAuth } from "@/api/auth/query";
import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    const res = await queryClient.fetchQuery(userQueryOptions);

    if (!!res.data) throw redirect({ to: "/" });
  },
});

function AuthLayout() {
  return <Outlet />;
}

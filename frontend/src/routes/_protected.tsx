import { userQueryOptions, validateAuth } from "@/api/auth/query";
import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  component: ProtectedLayout,
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    const res = await queryClient.fetchQuery(userQueryOptions);

    if (!res.data || !!res.error) {
      throw redirect({ to: "/auth/login" });
    }
  },
});

function ProtectedLayout() {
  return <Outlet />;
}

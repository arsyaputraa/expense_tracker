import LogoutButton from "@/components/LogoutButton";
import { type QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface AppRouterContext {
  queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: () => (
    <>
      <Root />
      <TanStackRouterDevtools />
    </>
  ),
});

function Navbar() {
  return (
    <div className="p-2 flex justify-between items-center max-w-2xl mx-auto ">
      <div className="flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/expenses" className="[&.active]:font-bold">
          Expenses
        </Link>
        <Link to="/expenses/create" className="[&.active]:font-bold">
          Create
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
      </div>

      <LogoutButton />
    </div>
  );
}

function Root() {
  return (
    <>
      <Navbar />
      <hr />
      <div className="max-w-2xl mx-auto mt-2">
        <Outlet />
      </div>
    </>
  );
}

import { userQueryOptions } from "@/api/auth/query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/profile/")({
  component: ProfilePage,
});

function ProfilePage() {
  const { data, isPending } = useQuery(userQueryOptions);

  if (isPending) return "Loading...";

  if (!!data?.error) return data?.error.message;

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <pre>{JSON.stringify(data?.data?.user, null, 2)}</pre>
      </CardContent>
    </Card>
  );
}

import React from "react";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logout } from "@/api/auth/mutation";
import { useNavigate } from "@tanstack/react-router";
import { queryClient } from "@/lib/query";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: ["logout-current-user"],
    mutationFn: logout,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["validate-current-user"] });
      navigate({ to: "/auth/login" });
    },
  });
  return (
    <Button
      disabled={isPending}
      onClick={() => {
        mutate();
      }}
    >
      {isPending ? "Loading..." : "Logout"}
    </Button>
  );
};

export default LogoutButton;

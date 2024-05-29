import { register } from "@/api/auth/mutation";
import { validateAuth } from "@/api/auth/query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { useRef } from "react";

export const Route = createFileRoute("/_auth/auth/signup")({
  component: SignUpPage,
});

function SignUpPage() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const { mutate, data, isPending } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (!!data.data) navigate({ to: "/" });
    },
  });

  return (
    <div className="flex flex-col gap-1">
      <label>name</label>
      <Input ref={nameRef} />
      <label>username</label>
      <Input ref={usernameRef} />
      <label>password</label>
      <Input ref={passwordRef} />
      <Button
        disabled={isPending}
        onClick={() => {
          mutate({
            username: usernameRef.current?.value as string,
            password: passwordRef.current?.value as string,
            fullName: nameRef.current?.value as string,
          });
        }}
      >
        {isPending ? "Loading..." : "LOGIN"}
      </Button>
      {data?.error?.message}
    </div>
  );
}

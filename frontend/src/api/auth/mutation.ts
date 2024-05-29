import { api } from "@/lib/api";

export const register = async ({
  username,
  password,
  fullName,
}: {
  username: string;
  password: string;
  fullName: string;
}) => {
  const res = await api.auth.register.$post({
    json: {
      username,
      password,
      fullName,
    },
  });

  if (!res.ok) throw new Error("server error");
  const data = await res.json();
  return data;
};

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const res = await api.auth.login.$post({
    json: {
      username,
      password,
    },
  });

  const data = await res.json();
  return data;
};

export const logout = async () => {
  const res = await api.auth.logout.$get();
  const data = await res.json();

  if (!!data.error) throw Error(data.error.message);
  return data;
};

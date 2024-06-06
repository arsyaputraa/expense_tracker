import { setSignedCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import type { UserTokenPayload } from "../schema/user";

const refreshTokenExpiration = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; //expires in a week
const accessTokenExpiration = Math.floor(Date.now() / 1000) + 60 * 15; // Token expires in 15 minutes

export const getNewToken = async (user: UserTokenPayload) => {
  const tokenPayload = {
    data: { user },
    exp: accessTokenExpiration,
  };

  const token = await sign(tokenPayload, process.env.JWT_SECRET!);
  const refresh = await sign(
    {
      ...tokenPayload,
      exp: refreshTokenExpiration,
    },
    process.env.JWT_SECRET!
  ); // exp in 1 week
  return { token, refresh };
};

export const setUserTokenCookie = async (
  c: any,
  token: string,
  refresh: string
) => {
  await setSignedCookie(
    c,
    process.env.TOKEN_COOKIE_NAME!,
    token,
    process.env.COOKIE_SECRET!,
    {
      httpOnly: true,
      // expires: new Date(accessTokenExpiration),
      maxAge: 60 * 15,
      secure: process.env.NODE_ENV === "production",
    }
  );

  await setSignedCookie(
    c,
    process.env.TOKEN_REFRESH_NAME!,
    refresh,
    process.env.COOKIE_SECRET!,
    {
      httpOnly: true,
      // expires: new Date(refreshTokenExpiration),
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    }
  );
};

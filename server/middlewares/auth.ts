import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { jwt, sign, verify } from "hono/jwt";
import type { UserTokenPayload } from "../schema/user";

type Env = {
  Variables: {
    user: UserTokenPayload;
  };
};
export const validateRequest = createMiddleware<Env>(async (c, next) => {
  try {
    const token = await getSignedCookie(
      c,
      process.env.COOKIE_SECRET!,
      process.env.TOKEN_COOKIE_NAME!
    );

    try {
      const tokenPayload: { data: { user: UserTokenPayload } } = await verify(
        token?.toString() as string,
        process.env.JWT_SECRET!
      );
      console.log("hasil verify access token", tokenPayload);

      c.set("user", tokenPayload.data.user);
      return await next();
    } catch (e) {
      const refresh = await getSignedCookie(
        c,
        process.env.COOKIE_SECRET!,
        process.env.TOKEN_REFRESH_NAME!
      );

      if (!refresh) {
        deleteCookie(c, process.env.TOKEN_REFRESH_NAME!);
        deleteCookie(c, process.env.TOKEN_COOKIE_NAME!);
        return c.json({ data: null, error: { message: "Unauthorized" } }, 401);
      }

      try {
        const refreshPayload: { data: { user: UserTokenPayload } } =
          await verify(refresh as string, process.env.JWT_SECRET!);

        const freshToken = await sign(
          {
            ...refreshPayload,
            exp: Math.floor(Date.now() / 1000) + 60 * 15,
          },
          process.env.JWT_SECRET!
        );

        console.log("this request generate fresh token", freshToken);
        await setSignedCookie(
          c,
          process.env.TOKEN_COOKIE_NAME!,
          freshToken,
          process.env.COOKIE_SECRET!
        );

        c.set("user", refreshPayload.data.user);
        return await next();
      } catch (e) {
        deleteCookie(c, process.env.TOKEN_REFRESH_NAME!);
        deleteCookie(c, process.env.TOKEN_COOKIE_NAME!);
        return c.json({ data: null, error: { message: "Unauthorized" } }, 401);
      }
    }
  } catch (error) {
    console.error(error);

    return c.json("internal server error", 500);
  }
});

import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { jwt, sign, verify } from "hono/jwt";
import type { UserTokenPayload } from "../../schema/user";

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

    if (!!token) {
      const tokenPayload: { data: { user: UserTokenPayload } } = await verify(
        token as string,
        process.env.JWT_SECRET!
      );
      if (!!tokenPayload) {
        console.log("setting userrr", tokenPayload);
        c.set("user", tokenPayload.data.user);
        return await next();
      }
    } else {
      const refresh = await getSignedCookie(
        c,
        process.env.COOKIE_SECRET!,
        process.env.TOKEN_REFRESH_NAME!
      );

      if (!!refresh) {
        const refreshPayload: { data: { user: UserTokenPayload } } =
          await verify(refresh as string, process.env.JWT_SECRET!);
        if (!refreshPayload) {
          deleteCookie(c, process.env.TOKEN_REFRESH_NAME!);
          deleteCookie(c, process.env.TOKEN_COOKIE_NAME!);

          return c.json(
            { data: null, error: { message: "Unauthorized" } },
            401
          );
        }

        const freshToken = await sign(
          {
            ...refreshPayload,
            exp: Math.floor(Date.now() / 1000) + 60 * 15,
          },
          process.env.JWT_SECRET!
        );

        await setSignedCookie(
          c,
          process.env.TOKEN_COOKIE_NAME!,
          freshToken,
          process.env.COOKIE_SECRET!
        );
        console.log("setting userrr refresh", refreshPayload.data.user);

        c.set("user", refreshPayload.data.user);
        return await next();
      } else {
        return c.json({ data: null, error: { message: "Unauthorized" } }, 401);
      }
    }
  } catch (error) {
    console.error(error);

    return c.json("internal server error", 500);
  }
});

import { Hono } from "hono";
import { getSignedCookie } from "hono/cookie";
import { decode } from "hono/jwt";
import { db } from "../db";
import { userTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { validateRequest } from "../middlewares/auth";

export const userRoutes = new Hono().get("/me", validateRequest, async (c) => {
  try {
    // const token = await getSignedCookie(
    //   c,
    //   process.env.COOKIE_SECRET!,
    //   process.env.TOKEN_COOKIE_NAME!
    // );

    // const tokenPayload = decode(token as string);
    // console.log("token coming from decodings", tokenPayload);

    // const [user] = await db
    //   .select()
    //   .from(userTable)
    //   .where(eq(userTable.id, c.user.id));

    const user = c.var.user;

    c.status(200);
    return c.json({
      data: { user },
      error: null,
    });
  } catch (error) {
    console.error(error);
    c.status(500);
    return c.json({
      data: null,
      error: { message: "Internal server error" },
    });
  }
});

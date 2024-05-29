import { compare, genSalt, hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";
import type { UserTokenPayload } from "../../schema/user";
import { db } from "../db";
import { userTable } from "../db/schema";
import { validateRequest } from "../middlewares/auth";
import { getNewToken, setUserTokenCookie } from "../utils/helper";

export const authRoutes = new Hono()
  .post("/register", async (c) => {
    const { username, password, fullName } = await c.req.json();

    try {
      const [existingUser] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.username, username));

      if (!!existingUser) {
        c.status(400);
        return c.json({ data: null, error: { message: "User already exist" } });
      }

      let hashedPassword;
      const salt = await genSalt(10);
      hashedPassword = await hash(password, salt);
      if (!hashedPassword) {
        c.status(500);
        return c.json({
          data: null,
          error: { message: "Something went wrong when hashing password" },
        });
      }

      const newUser = await db
        .insert(userTable)
        .values({ username, fullName, password: hashedPassword })
        .returning({ id: userTable.id });

      const { token, refresh } = await getNewToken({
        username,
        fullName,
        id: newUser[0].id,
      });

      await setUserTokenCookie(c, token, refresh);

      c.status(201);
      return c.json({
        data: { user: { username, fullName }, token: { token, refresh } },
        error: null,
      });
    } catch (error) {
      console.error("the error", error);
      c.status(500);
      return c.json({
        data: null,
        error: { message: "Internal server error" },
      });
    }
  })
  .post("/login", async (c) => {
    const { username, password } = await c.req.json();

    try {
      // Find user by username
      const [user] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.username, username));
      if (!user) {
        c.status(400);
        return c.json({
          data: null,
          error: { message: "User not found" },
        });
      }

      // Validate password
      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        c.status(401);
        return c.json({ data: null, error: { message: "Invalid password" } });
      }

      const tokenUserPayload: UserTokenPayload = {
        fullName: user.fullName || "",
        username: user.username,
        id: user.id,
      };

      const { token, refresh } = await getNewToken(tokenUserPayload);

      await setUserTokenCookie(c, token, refresh);

      // Return tokens
      c.status(200);
      return c.json({
        data: { user: tokenUserPayload },
        error: null,
      });
    } catch (error) {
      console.error(error);

      return c.json(
        {
          data: null,
          error: { message: "Internal server error" },
        },
        500
      );
    }
  })
  .get("/logout", validateRequest, async (c) => {
    try {
      const user = c.var.user;
      console.log("userrr", user);
      if (user) {
        deleteCookie(c, process.env.TOKEN_REFRESH_NAME!);
        deleteCookie(c, process.env.TOKEN_COOKIE_NAME!);
      }
      return c.json({ data: { user }, error: null }, 200);
    } catch (e) {
      return c.json(
        { data: null, error: { message: "Internal server error" } },
        500
      );
    }
  });

import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  username: varchar("username", { length: 256 }).notNull().unique(),
  password: varchar("password").notNull(),
});

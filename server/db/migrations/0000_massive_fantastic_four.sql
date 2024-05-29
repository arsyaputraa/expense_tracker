CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text,
	"username" varchar(256) NOT NULL,
	"password" varchar NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);

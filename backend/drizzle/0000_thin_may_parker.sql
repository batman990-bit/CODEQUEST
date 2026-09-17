CREATE TABLE "user_info" (
	"uid" text PRIMARY KEY NOT NULL,
	"user_name" text NOT NULL,
	"user_email" text NOT NULL,
	"user_progress" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_info_user_name_unique" UNIQUE("user_name"),
	CONSTRAINT "user_info_user_email_unique" UNIQUE("user_email")
);

CREATE TABLE IF NOT EXISTS "project_y_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_y_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" varchar(255),
	CONSTRAINT "project_y_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_y_session" ADD CONSTRAINT "project_y_session_user_id_project_y_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."project_y_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

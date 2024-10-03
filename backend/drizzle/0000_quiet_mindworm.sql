DO $$ BEGIN
 CREATE TYPE "public"."message_author" AS ENUM('assistant', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_y_chat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"god_name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_y_god" (
	"name" text PRIMARY KEY NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_y_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" uuid NOT NULL,
	"body" text NOT NULL,
	"from" "message_author" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_y_chat" ADD CONSTRAINT "project_y_chat_god_name_project_y_god_name_fk" FOREIGN KEY ("god_name") REFERENCES "public"."project_y_god"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_y_message" ADD CONSTRAINT "project_y_message_chat_id_project_y_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."project_y_chat"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

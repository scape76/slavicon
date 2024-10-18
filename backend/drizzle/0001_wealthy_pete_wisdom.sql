ALTER TABLE "project_y_chat" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "project_y_chat" ADD COLUMN "updated_at" timestamp DEFAULT current_timestamp;
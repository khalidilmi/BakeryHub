CREATE TABLE IF NOT EXISTS "bakery_hours" (
	"id" serial PRIMARY KEY NOT NULL,
	"baker_id" integer NOT NULL,
	"day_of_week" text NOT NULL,
	"opening_time" time NOT NULL,
	"closing_time" time NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"baker_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bakery_hours" ADD CONSTRAINT "bakery_hours_baker_id_bakers_id_fk" FOREIGN KEY ("baker_id") REFERENCES "public"."bakers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favorites" ADD CONSTRAINT "favorites_baker_id_bakers_id_fk" FOREIGN KEY ("baker_id") REFERENCES "public"."bakers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

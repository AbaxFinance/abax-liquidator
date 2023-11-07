ALTER TABLE "events" ADD COLUMN "hash" char(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN IF EXISTS "verifiedUniqueness";--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_hash_unique" UNIQUE("hash");
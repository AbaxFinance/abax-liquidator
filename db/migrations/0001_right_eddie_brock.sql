DROP INDEX IF EXISTS "address_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_id_index" ON "lp_reserveDatas" ("address","id");
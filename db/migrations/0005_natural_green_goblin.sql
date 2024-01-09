DROP INDEX IF EXISTS "address_id_index";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_id_timestamp_index" ON "lp_reserveDatas" ("address","id","updateTimestamp");
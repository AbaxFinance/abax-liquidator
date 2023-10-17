CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"contractName" varchar(32),
	"contractAddress" varchar(48),
	"name" varchar(48),
	"timestamp" integer,
	"blockNumber" integer,
	"blockHash" varchar(66)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "events" ("name");
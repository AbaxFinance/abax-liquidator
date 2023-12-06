CREATE TABLE IF NOT EXISTS "lp_marketRules" (
	"id" integer PRIMARY KEY NOT NULL,
	"assetRules" json
);
--> statement-breakpoint
ALTER TABLE "asset_prices" ALTER COLUMN "updateTimestamp" SET DATA TYPE timestamp with time zone;
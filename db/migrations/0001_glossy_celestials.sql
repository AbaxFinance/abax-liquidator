ALTER TABLE "asset_prices" DROP CONSTRAINT "asset_prices_address_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'asset_prices'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

ALTER TABLE "asset_prices" DROP CONSTRAINT "asset_prices_pkey";--> statement-breakpoint
ALTER TABLE "lp_marketRules" ALTER COLUMN "assetRules" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "asset_prices" ADD COLUMN "source" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "asset_prices" ADD CONSTRAINT "ap_address_source_idx" PRIMARY KEY("address","source");
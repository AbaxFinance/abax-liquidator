DROP INDEX IF EXISTS "address_idx";--> statement-breakpoint
ALTER TABLE "actors_states" ALTER COLUMN "actor" SET DATA TYPE char(64);--> statement-breakpoint
ALTER TABLE "asset_prices" ALTER COLUMN "address" SET DATA TYPE char(48);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "contractAddress" SET DATA TYPE char(48);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "blockHash" SET DATA TYPE char(64);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "hash" SET DATA TYPE char(66);--> statement-breakpoint
ALTER TABLE "lp_reserveDatas" ALTER COLUMN "address" SET DATA TYPE char(48);--> statement-breakpoint
ALTER TABLE "lp_trackingData" ALTER COLUMN "address" SET DATA TYPE char(48);--> statement-breakpoint
ALTER TABLE "lp_userConfigs" ALTER COLUMN "address" SET DATA TYPE char(48);--> statement-breakpoint
ALTER TABLE "lp_userDatas" ALTER COLUMN "address" SET DATA TYPE char(48);--> statement-breakpoint
ALTER TABLE "lp_userDatas" ALTER COLUMN "reserveAddress" SET DATA TYPE char(48);--> statement-breakpoint
ALTER TABLE "lp_trackingData" ADD CONSTRAINT "lp_trackingData_address_unique" UNIQUE("address");
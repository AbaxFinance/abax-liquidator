ALTER TABLE "asset_prices" RENAME COLUMN "currentPriceE8" TO "currentPriceE18";--> statement-breakpoint
ALTER TABLE "asset_prices" RENAME COLUMN "anchorPriceE8" TO "anchorPriceE18";--> statement-breakpoint
ALTER TABLE "asset_prices" DROP CONSTRAINT "ap_address_source_idx";--> statement-breakpoint
ALTER TABLE "asset_prices" ADD CONSTRAINT "ap_address_source_idx" PRIMARY KEY("address","source");
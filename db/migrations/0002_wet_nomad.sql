DROP TABLE "lp_userMiscData";--> statement-breakpoint
ALTER TABLE "lp_trackingData" ALTER COLUMN "updateAtLatest" SET DATA TYPE timestamp with time zone USING to_timestamp("updateAtLatest");
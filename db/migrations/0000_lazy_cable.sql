CREATE TABLE IF NOT EXISTS "analyzedBlocks" (
	"blockNumber" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "asset_prices" (
	"name" varchar(48) PRIMARY KEY NOT NULL,
	"address" char(48) NOT NULL,
	"currentPriceE8" varchar(128) NOT NULL,
	"anchorPriceE8" varchar(128) NOT NULL,
	"updateTimestamp" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "asset_prices_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"contractName" varchar(32) NOT NULL,
	"contractAddress" char(48) NOT NULL,
	"name" varchar(48) NOT NULL,
	"blockTimestamp" timestamp with time zone NOT NULL,
	"blockNumber" integer NOT NULL,
	"blockHash" char(66) NOT NULL,
	"data" jsonb NOT NULL,
	"hash" char(66) NOT NULL,
	CONSTRAINT "events_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lp_marketRules" (
	"id" integer PRIMARY KEY NOT NULL,
	"assetRules" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lp_reserveDatas" (
	"id" integer PRIMARY KEY NOT NULL,
	"address" char(48) NOT NULL,
	"maximalTotalDeposit" varchar(256),
	"maximalTotalDebt" varchar(256),
	"minimalCollateral" varchar(128) NOT NULL,
	"minimalDebt" varchar(128) NOT NULL,
	"depositIndexE18" varchar(128) NOT NULL,
	"debtIndexE18" varchar(128) NOT NULL,
	"indexesUpdateTimestamp" timestamp with time zone NOT NULL,
	"debtFeeE6" varchar(128) NOT NULL,
	"depositFeeE6" varchar(128) NOT NULL,
	"decimalMultiplier" varchar(128) NOT NULL,
	"activated" boolean NOT NULL,
	"freezed" boolean NOT NULL,
	"totalDeposit" varchar NOT NULL,
	"currentDepositRateE18" varchar(128) NOT NULL,
	"totalDebt" varchar(128) NOT NULL,
	"currentDebtRateE18" varchar(128) NOT NULL,
	"interestRateModel" jsonb,
	CONSTRAINT "lp_reserveDatas_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lp_trackingData" (
	"address" char(48) PRIMARY KEY NOT NULL,
	"updatePriority" integer NOT NULL,
	"helathFactor" double precision NOT NULL,
	"updateAtLatest" timestamp with time zone NOT NULL,
	"updateTimestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lp_userConfigs" (
	"address" char(48) PRIMARY KEY NOT NULL,
	"deposits" varchar(128) NOT NULL,
	"collaterals" varchar(128) NOT NULL,
	"borrows" varchar(128) NOT NULL,
	"marketRuleId" integer NOT NULL,
	"updateTimestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lp_userDatas" (
	"address" char(48) NOT NULL,
	"reserveAddress" char(48) NOT NULL,
	"deposit" varchar(256) NOT NULL,
	"debt" varchar(256) NOT NULL,
	"appliedCumulativeDepositIndexE18" varchar(256) NOT NULL,
	"appliedCumulativeDebtIndexE18" varchar(256) NOT NULL,
	"updateTimestamp" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT address_reserve_idx PRIMARY KEY("address","reserveAddress")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "asset_prices" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "events" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_id_index" ON "lp_reserveDatas" ("address","id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_idx" ON "lp_userConfigs" ("address");
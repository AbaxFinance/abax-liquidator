CREATE TABLE IF NOT EXISTS "actors_states" (
	"id" serial PRIMARY KEY NOT NULL,
	"actor" varchar(64) NOT NULL,
	"timestamp" timestamp NOT NULL,
	"jobType" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "asset_prices" (
	"name" varchar(48) PRIMARY KEY NOT NULL,
	"address" varchar(48) NOT NULL,
	"currentPriceE8" varchar(128) NOT NULL,
	"anchorPriceE8" varchar(128) NOT NULL,
	"updateTimestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"contractName" varchar(32) NOT NULL,
	"contractAddress" varchar(48) NOT NULL,
	"name" varchar(48) NOT NULL,
	"timestamp" integer NOT NULL,
	"blockNumber" integer NOT NULL,
	"blockHash" varchar(66) NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lp_reserveDatas" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" varchar(48) NOT NULL,
	"maximalTotalDeposit" varchar(256),
	"maximalTotalDebt" varchar(256),
	"minimalCollateral" varchar(128) NOT NULL,
	"minimalDebt" varchar(128) NOT NULL,
	"cumulativeDepositIndexE18" varchar(128) NOT NULL,
	"cumulativeDebtIndexE18" varchar(128) NOT NULL,
	"decimals" varchar(128) NOT NULL,
	"tokenPriceE8" varchar(128),
	"activated" boolean NOT NULL,
	"freezed" boolean NOT NULL,
	"totalDeposit" varchar NOT NULL,
	"currentDepositRateE24" varchar(128) NOT NULL,
	"totalDebt" varchar(128) NOT NULL,
	"currentDebtRateE24" varchar(128) NOT NULL,
	"indexesUpdateTimestamp" integer,
	"interestRateModel" jsonb NOT NULL,
	"incomeForSuppliersPartE6" varchar(128) NOT NULL,
	CONSTRAINT "lp_reserveDatas_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lp_trackingData" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" varchar(48) NOT NULL,
	"updatePriority" integer NOT NULL,
	"helathFactor" double precision NOT NULL,
	"updateAtLatest" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lp_userConfigs" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" varchar(48) NOT NULL,
	"deposits" varchar(128) NOT NULL,
	"collaterals" varchar(128) NOT NULL,
	"borrows" varchar(128) NOT NULL,
	"marketRuleId" integer NOT NULL,
	CONSTRAINT "lp_userConfigs_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lp_userDatas" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" varchar(48) NOT NULL,
	"reserveAddress" varchar(48) NOT NULL,
	"deposit" varchar(256) NOT NULL,
	"debt" varchar(256) NOT NULL,
	"appliedCumulativeDepositIndexE18" varchar(256) NOT NULL,
	"appliedCumulativeDebtIndexE18" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lp_userMiscData" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" varchar(48) NOT NULL,
	"updatePriority" integer NOT NULL,
	"helathFactor" double precision NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "actor_idx" ON "actors_states" ("actor");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "asset_prices" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "events" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_idx" ON "lp_reserveDatas" ("address");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_idx" ON "lp_trackingData" ("address");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_idx" ON "lp_userConfigs" ("address");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_idx" ON "lp_userDatas" ("address");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_reserve_idx" ON "lp_userDatas" ("address","reserveAddress");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_idx" ON "lp_userMiscData" ("address");
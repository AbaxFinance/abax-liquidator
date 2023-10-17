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
	CONSTRAINT "addr" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lp_userConfigs" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" varchar(48) NOT NULL,
	"deposits" varchar(128) NOT NULL,
	"collaterals" varchar(128) NOT NULL,
	"borrows" varchar(128) NOT NULL,
	"marketRuleId" integer NOT NULL,
	CONSTRAINT "addr" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lp_userDatas" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" varchar(48) NOT NULL,
	"reserveAddress" varchar(48) NOT NULL,
	"deposit" varchar(256) NOT NULL,
	"appliedCumulativeDepositIndexE18" varchar(256) NOT NULL,
	"appliedCumulativeDebtIndexE18" varchar(256) NOT NULL,
	CONSTRAINT "addr" UNIQUE("address","reserveAddress")
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "data" jsonb;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_idx" ON "lp_reserveDatas" ("address");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_idx" ON "lp_userConfigs" ("address");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_idx" ON "lp_userDatas" ("address");
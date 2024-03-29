import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { boolean, char, doublePrecision, integer, jsonb, pgTable, primaryKey, serial, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const DB_NAME = 'liquidator_db';

export const analyzedBlocks = pgTable('analyzedBlocks', {
  blockNumber: integer('blockNumber').primaryKey(),
});

export const events = pgTable(
  'events',
  {
    id: serial('id').primaryKey(),
    contractName: varchar('contractName', { length: 32 }).notNull(),
    contractAddress: char('contractAddress', { length: 48 }).notNull(),
    name: varchar('name', { length: 48 }).notNull(),
    blockTimestamp: timestamp('blockTimestamp', { withTimezone: true }).notNull(),
    blockNumber: integer('blockNumber').notNull(),
    blockHash: char('blockHash', { length: 66 }).notNull(),
    data: jsonb('data').notNull(),
    hash: char('hash', { length: 66 }).notNull().unique(),
  },
  (c) => {
    return {
      nameIndex: uniqueIndex('name_idx').on(c.name),
    };
  },
);

export type InsertEvent = InferInsertModel<typeof events>;
export type InsertLPUserConfig = InferInsertModel<typeof lpUserConfigs>;
export type InsertLPUserData = InferInsertModel<typeof lpUserDatas>;
export type InsertAssetPrice = InferInsertModel<typeof assetPrices>;
export type InsertLPReserveData = InferInsertModel<typeof lpReserveDatas>;
export type SelectAssetPrice = InferSelectModel<typeof assetPrices>;

export const lpTrackingData = pgTable('lp_trackingData', {
  address: char('address', { length: 48 }).primaryKey(),
  updatePriority: integer('updatePriority').notNull(),
  healthFactor: doublePrecision('healthFactor').notNull(),
  updateAtLatest: timestamp('updateAtLatest', { withTimezone: true }).notNull(),
  updateTimestamp: timestamp('updateTimestamp', { withTimezone: true }).notNull().defaultNow(),
});

export const lpUserDatas = pgTable(
  'lp_userDatas',
  {
    address: char('address', { length: 48 }).notNull(),
    reserveAddress: char('reserveAddress', { length: 48 }).notNull(),
    deposit: varchar('deposit', { length: 256 }).notNull(),
    debt: varchar('debt', { length: 256 }).notNull(),
    appliedCumulativeDepositIndexE18: varchar('appliedCumulativeDepositIndexE18', { length: 256 }).notNull(),
    appliedCumulativeDebtIndexE18: varchar('appliedCumulativeDebtIndexE18', { length: 256 }).notNull(),
    updateTimestamp: timestamp('updateTimestamp', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => {
    return {
      pk: primaryKey({ name: 'address_reserve_updatetimestamp_idx', columns: [t.address, t.reserveAddress, t.updateTimestamp] }),
    };
  },
);

export const lpUserConfigs = pgTable(
  'lp_userConfigs',
  {
    address: char('address', { length: 48 }).notNull(),
    deposits: varchar('deposits', { length: 128 }).notNull(),
    collaterals: varchar('collaterals', { length: 128 }).notNull(),
    borrows: varchar('borrows', { length: 128 }).notNull(),
    marketRuleId: integer('marketRuleId').notNull(),
    updateTimestamp: timestamp('updateTimestamp', { withTimezone: true }).notNull().defaultNow(),
  },
  (c) => {
    return {
      pk: primaryKey({ name: 'cfg_address_updatetimestamp_idx', columns: [c.address, c.updateTimestamp] }),
    };
  },
);
export const lpMarketRules = pgTable('lp_marketRules', {
  id: integer('id').primaryKey(),
  assetRules: jsonb('assetRules').$type<
    | Array<{
        collateralCoefficientE6: string | null;
        borrowCoefficientE6: string | null;
        penaltyE6: string | null;
      } | null>
    | null
    | undefined
  >(),
});

export const lpReserveDatas = pgTable(
  'lp_reserveDatas',
  {
    id: integer('id').notNull(),
    address: char('address', { length: 48 }).notNull(),
    //restrictions
    maximalTotalDeposit: varchar('maximalTotalDeposit', { length: 256 }),
    maximalTotalDebt: varchar('maximalTotalDebt', { length: 256 }),
    minimalCollateral: varchar('minimalCollateral', { length: 128 }).notNull(),
    minimalDebt: varchar('minimalDebt', { length: 128 }).notNull(),
    //indexes
    depositIndexE18: varchar('depositIndexE18', { length: 128 }).notNull(),
    debtIndexE18: varchar('debtIndexE18', { length: 128 }).notNull(),
    indexesUpdateTimestamp: timestamp('indexesUpdateTimestamp', { withTimezone: true }).notNull(),
    //fees
    debtFeeE6: varchar('debtFeeE6', { length: 128 }).notNull(),
    depositFeeE6: varchar('depositFeeE6', { length: 128 }).notNull(),
    //price
    decimalMultiplier: varchar('decimalMultiplier', { length: 128 }).notNull(),
    //core data
    activated: boolean('activated').notNull(),
    freezed: boolean('freezed').notNull(),
    totalDeposit: varchar('totalDeposit').notNull(),
    currentDepositRateE18: varchar('currentDepositRateE18', { length: 128 }).notNull(),
    totalDebt: varchar('totalDebt', { length: 128 }).notNull(),
    currentDebtRateE18: varchar('currentDebtRateE18', { length: 128 }).notNull(),
    //parameters
    interestRateModel: jsonb('interestRateModel').$type<[string, string, string, string, string, string, string]>(),
    updateTimestamp: timestamp('updateTimestamp', { withTimezone: true }).notNull().defaultNow(),
  },
  (c) => {
    return {
      pk: primaryKey({ name: 'address_id_timestamp_index', columns: [c.address, c.id, c.updateTimestamp] }),
    };
  },
);

export const assetPrices = pgTable(
  'asset_prices',
  {
    name: varchar('name', { length: 48 }).notNull(),
    address: char('address', { length: 48 }).notNull(),
    currentPriceE18: varchar('currentPriceE18', { length: 128 }).notNull(),
    anchorPriceE18: varchar('anchorPriceE18', { length: 128 }).notNull(),
    updateTimestamp: timestamp('updateTimestamp', { withTimezone: true }).defaultNow().notNull(),
    source: integer('source').notNull(),
  },
  (t) => {
    return {
      pk: primaryKey({ name: 'ap_address_source_idx', columns: [t.address, t.source] }),
    };
  },
);

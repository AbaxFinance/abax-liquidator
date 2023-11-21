import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { boolean, char, doublePrecision, integer, json, jsonb, pgTable, serial, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

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
export type SelectAssetPrice = InferSelectModel<typeof assetPrices>;

export const actorsJobs = pgTable(
  'actors_states',
  {
    id: serial('id').primaryKey(),
    actor: char('actor', { length: 64 }).notNull(),
    updateTimestamp: timestamp('updateTimestamp', { withTimezone: true }).notNull(),
    jobType: varchar('jobType', { length: 128 }).notNull(),
  },
  (c) => {
    return {
      actorIndex: uniqueIndex('actor_idx').on(c.actor),
    };
  },
);

export const lpTrackingData = pgTable('lp_trackingData', {
  id: serial('id').primaryKey(),
  address: char('address', { length: 48 }).notNull().unique(),
  updatePriority: integer('updatePriority').notNull(),
  healthFactor: doublePrecision('helathFactor').notNull(),
  updateAtLatest: timestamp('updateAtLatest', { withTimezone: true }).notNull(),
});

export const lpUserDatas = pgTable(
  'lp_userDatas',
  {
    id: serial('id').primaryKey(),
    address: char('address', { length: 48 }).notNull(),
    reserveAddress: char('reserveAddress', { length: 48 }).notNull(),
    deposit: varchar('deposit', { length: 256 }).notNull(),
    debt: varchar('debt', { length: 256 }).notNull(),
    appliedCumulativeDepositIndexE18: varchar('appliedCumulativeDepositIndexE18', { length: 256 }).notNull(),
    appliedCumulativeDebtIndexE18: varchar('appliedCumulativeDebtIndexE18', { length: 256 }).notNull(),
  },
  (c) => {
    return {
      addressIndex: uniqueIndex('address_idx').on(c.address),
      addressReserveIndex: uniqueIndex('address_reserve_idx').on(c.address, c.reserveAddress),
    };
  },
);

export const lpUserConfigs = pgTable(
  'lp_userConfigs',
  {
    id: serial('id').primaryKey(),
    address: char('address', { length: 48 }).unique().notNull(),
    deposits: varchar('deposits', { length: 128 }).notNull(),
    collaterals: varchar('collaterals', { length: 128 }).notNull(),
    borrows: varchar('borrows', { length: 128 }).notNull(),
    marketRuleId: integer('marketRuleId').notNull(),
  },
  (c) => {
    return {
      addressIndex: uniqueIndex('address_idx').on(c.address),
    };
  },
);
export const lpMarketRules = pgTable('lp_marketRules', {
  id: integer('id').primaryKey(),
  assetRules: json('assetRules'),
});

export const lpReserveDatas = pgTable(
  'lp_reserveDatas',
  {
    id: serial('id').primaryKey(),
    address: char('address', { length: 48 }).unique().notNull(),
    //restrictions
    maximalTotalDeposit: varchar('maximalTotalDeposit', { length: 256 }),
    maximalTotalDebt: varchar('maximalTotalDebt', { length: 256 }),
    minimalCollateral: varchar('minimalCollateral', { length: 128 }).notNull(),
    minimalDebt: varchar('minimalDebt', { length: 128 }).notNull(),
    //indexes
    cumulativeDepositIndexE18: varchar('cumulativeDepositIndexE18', { length: 128 }).notNull(),
    cumulativeDebtIndexE18: varchar('cumulativeDebtIndexE18', { length: 128 }).notNull(),
    //price
    decimals: varchar('decimals', { length: 128 }).notNull(),
    tokenPriceE8: varchar('tokenPriceE8', { length: 128 }),
    //core data
    activated: boolean('activated').notNull(),
    freezed: boolean('freezed').notNull(),
    totalDeposit: varchar('totalDeposit').notNull(),
    currentDepositRateE24: varchar('currentDepositRateE24', { length: 128 }).notNull(),
    totalDebt: varchar('totalDebt', { length: 128 }).notNull(),
    currentDebtRateE24: varchar('currentDebtRateE24', { length: 128 }).notNull(),
    indexesUpdateTimestamp: timestamp('indexesUpdateTimestamp', { withTimezone: true }).notNull(),
    //parameters
    interestRateModel: jsonb('interestRateModel').notNull(),
    incomeForSuppliersPartE6: varchar('incomeForSuppliersPartE6', { length: 128 }).notNull(),
  },
  (c) => {
    return {
      addressIndex: uniqueIndex('address_idx').on(c.address),
    };
  },
);

export const assetPrices = pgTable(
  'asset_prices',
  {
    name: varchar('name', { length: 48 }).primaryKey(),
    address: char('address', { length: 48 }).unique().notNull(),
    currentPriceE8: varchar('currentPriceE8', { length: 128 }).notNull(),
    anchorPriceE8: varchar('anchorPriceE8', { length: 128 }).notNull(),
    updateTimestamp: timestamp('updateTimestamp').defaultNow().notNull(),
  },
  (c) => {
    return {
      nameIndex: uniqueIndex('name_idx').on(c.name),
    };
  },
);

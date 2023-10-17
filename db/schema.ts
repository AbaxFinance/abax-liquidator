//import { InferSelectModel } from 'drizzle-orm';
import { integer, pgTable, serial, uniqueIndex, varchar, jsonb, unique, boolean } from 'drizzle-orm/pg-core';

export const events = pgTable(
  'events',
  {
    id: serial('id').primaryKey(),
    contractName: varchar('contractName', { length: 32 }),
    contractAddress: varchar('contractAddress', { length: 48 }),
    name: varchar('name', { length: 48 }),
    timestamp: integer('timestamp'),
    blockNumber: integer('blockNumber'),
    blockHash: varchar('blockHash', { length: 66 }),
    data: jsonb('data'),
  },
  (c) => {
    return {
      nameIndex: uniqueIndex('name_idx').on(c.name),
    };
  },
);

export const lpUserDatas = pgTable(
  'lp_userDatas',
  {
    id: serial('id').primaryKey(),
    address: varchar('address', { length: 48 }).notNull(),
    reserveAddress: varchar('reserveAddress', { length: 48 }).notNull(),
    deposit: varchar('deposit', { length: 256 }).notNull(),
    appliedCumulativeDepositIndexE18: varchar('appliedCumulativeDepositIndexE18', { length: 256 }).notNull(),
    appliedCumulativeDebtIndexE18: varchar('appliedCumulativeDebtIndexE18', { length: 256 }).notNull(),
  },
  (c) => {
    return {
      addressIndex: uniqueIndex('address_idx').on(c.address),
      unq: unique('addr').on(c.address, c.reserveAddress),
    };
  },
);

export const lpUserConfigs = pgTable(
  'lp_userConfigs',
  {
    id: serial('id').primaryKey(),
    address: varchar('address', { length: 48 }).unique('addr').notNull(),
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

export const lpReserveDatas = pgTable(
  'lp_reserveDatas',
  {
    id: serial('id').primaryKey(),
    address: varchar('address', { length: 48 }).unique('addr').notNull(),
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
    indexesUpdateTimestamp: integer('indexesUpdateTimestamp'),
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

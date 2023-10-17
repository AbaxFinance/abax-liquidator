import { integer, pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

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
  },
  (c) => {
    return {
      nameIndex: uniqueIndex('name_idx').on(c.name),
    };
  },
);

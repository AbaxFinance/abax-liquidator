import type { Config } from 'drizzle-kit';
import 'dotenv/config';
import { getConnectionOptions } from '@db/connection';

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  driver: 'pg',
  dbCredentials: getConnectionOptions(),
} satisfies Config;

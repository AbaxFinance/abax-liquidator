import type { Config } from 'drizzle-kit';
import 'dotenv/config';
import { getConnectionString } from '@db/connection';

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: getConnectionString(),
  },
} satisfies Config;

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { getConnectionString } from '@db/connection';

// const queryClient = postgres(getConnectionOptions());
const queryClient = postgres(getConnectionString());
export const db = drizzle(queryClient, { schema });

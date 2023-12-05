import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { getConnectionOptions } from '@db/connection';

// const queryClient = postgres(getConnectionOptions());
const queryClient = postgres(getConnectionOptions());
export const db = drizzle(queryClient, { schema });

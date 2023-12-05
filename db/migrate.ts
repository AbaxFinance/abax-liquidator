import { getConnectionString } from '@db/connection';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'path';
import postgres from 'postgres';
import * as schema from './schema';

const migrationClient = postgres(getConnectionString(), {
  max: 1,
});
const db = drizzle(migrationClient, { schema });
// this will automatically run needed migrations on the database
migrate(db, { migrationsFolder: path.resolve(__dirname, 'migrations') })
  .then(() => {
    console.log('Migrations complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migrations failed!', err);
    process.exit(1);
  });

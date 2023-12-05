import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import path from 'path';
import { getConnectionString } from '@db/connection';

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

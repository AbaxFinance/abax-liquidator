import { getConnectionOptions, getConnectionString } from '@db/connection';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'path';
import postgres from 'postgres';
import * as schema from './schema';
import { DB_NAME } from './schema';

const migrationClient = postgres(getConnectionString(), {
  max: 1,
});
const db = drizzle(migrationClient, { schema });

async function ensureDbExists() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { database, ...rest } = getConnectionOptions();
  const sql = postgres(rest);
  /////
  console.log('ensuring db exists');
  const rowsReturned = await sql.unsafe(`SELECT FROM pg_database WHERE datname = '${DB_NAME}'`);
  console.log(rowsReturned);
  if (rowsReturned.length === 0) {
    await sql.unsafe(`CREATE DATABASE ${DB_NAME}`);
    console.log('created database');
  }

  // const userRowsReturned = await sql`SELECT FROM pg_roles where rolname = ${applicationDatabaseUser}`;
  // if (userRowsReturned.length === 0) {
  //   //user doesn't exist. make it
  //   await sql`CREATE USER ${applicationDatabaseUser} with ENCRYPTED PASSWORD '${applicationDatabasePassword}'`;
  //   await sql`GRANT ALL PRIVILEGES ON DATABASE ${applicationDatabaseName} TO ${applicationDatabaseUser}`;
  // }
}
ensureDbExists().then(() => {
  migrate(db, { migrationsFolder: path.resolve(__dirname, 'migrations') })
    .then(() => {
      console.log('Migrations complete!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migrations failed!', err);
      process.exit(1);
    });
});

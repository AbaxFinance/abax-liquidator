import { DB_NAME } from '@db/schema';
import dotenv from 'dotenv';
dotenv.config({ path: `.env.migration` });
export const getConnectionOptions = () => {
  if (!process.env.POSTGRES_USER) throw new Error('POSTGRES_USER variable missing');
  if (!process.env.POSTGRES_PASSWORD) throw new Error('POSTGRES_PASSWORD variable missing');
  if (!process.env.POSTGRES_HOST) throw new Error('POSTGRES_HOST variable missing');
  return {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: 5432,
    database: DB_NAME,
    debug: true,
    // ssl: true,
  } as {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    debug: boolean;
    // ssl: boolean;
  };
};

export const getConnectionString = () => {
  const connectionOptions = getConnectionOptions();
  return `postgres://${connectionOptions.user}:${connectionOptions.password}@${connectionOptions.host}:${connectionOptions.port}/${connectionOptions.database}`;
};

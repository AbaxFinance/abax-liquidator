import dotenv from 'dotenv';
dotenv.config({ path: `.env.local` });
export const getConnectionString = () => {
  if (!process.env.POSTGRES_USER) throw new Error('POSTGRES_USER variable missing');
  if (!process.env.POSTGRES_PASSWORD) throw new Error('POSTGRES_PASSWORD variable missing');
  if (!process.env.POSTGRES_HOST) throw new Error('POSTGRES_HOST variable missing');
  //   DATABASE_URL='postgres://postgres:changeme@127.0.0.1:5432/liquidator_db'
  //   if (asConnectionString)
  return `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432/liquidator_db`;
  //   return {
  //     user: process.env.POSTGRES_USER,
  //     password: process.env.POSTGRES_PASSWORD,
  //     host: process.env.POSTGRES_HOST,
  //     port: 5432,
  //     database: 'liquidator_db',
  //     debug: true,
  //     // ssl: true,
  //   } as {
  //     host: string;
  //     port: number;
  //     user: string;
  //     password: string;
  //     database: string;
  //     debug: boolean;
  //     // ssl: boolean;
  //   };
};

import pino from 'pino';
import path from 'path';

const actorNamePrefix = process.env.ACTOR_TO_RUN?.toLocaleLowerCase();

const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: path.join('/app', 'logs', `${actorNamePrefix}.log`), mkdir: true },
    },
    {
      target: 'pino/file',
      options: { destination: path.join('/app', 'logs', `combined.log`), mkdir: true },
    },
    {
      target: 'pino/file',
    },
  ],
});

export const logger = pino(
  {
    level: process.env.LOG_LEVEL?.toLowerCase() || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport,
);

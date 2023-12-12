import path from 'path';
import pino from 'pino';

const actorNamePrefix = process.env.ACTOR_TO_RUN?.toLocaleLowerCase();

const GLOBAL_LOGGER_LEVEL = process.env.LOG_LEVEL?.toLowerCase() || 'info';

const transport = pino.transport({
  targets: [
    {
      level: GLOBAL_LOGGER_LEVEL,
      target: 'pino/file',
      options: { destination: path.join('/app', 'logs', `${actorNamePrefix}.log`), mkdir: true },
    },
    { level: GLOBAL_LOGGER_LEVEL, target: 'pino/file', options: { destination: path.join('/app', 'logs', `combined.log`), mkdir: true } },
    { level: GLOBAL_LOGGER_LEVEL, target: 'pino/file' },
  ],
});

export const logger = pino({ level: GLOBAL_LOGGER_LEVEL, timestamp: pino.stdTimeFunctions.isoTime }, transport);

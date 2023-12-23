import path from 'path';
import pino from 'pino';

const actorNamePrefix = process.env.ACTOR_TO_RUN?.toLocaleLowerCase();

const GLOBAL_LOGGER_LEVEL = process.env.LOG_LEVEL?.toLowerCase() || 'info';

const LOG_PATH_BASE = path.join('/app', 'logs');

function createCommonLogTargetOptions(destinationFileName: string) {
  return { destination: path.join(LOG_PATH_BASE, destinationFileName), mkdir: true };
}

const transport = pino.transport({
  targets: [
    ...(process.env.DOCKER_ENV
      ? [
          {
            level: GLOBAL_LOGGER_LEVEL,
            target: 'pino/file',
            options: createCommonLogTargetOptions(`${actorNamePrefix}.log`),
          },
          {
            level: GLOBAL_LOGGER_LEVEL,
            target: 'pino/file',
            options: createCommonLogTargetOptions(`combined.log`),
          },
        ]
      : []),
    { level: GLOBAL_LOGGER_LEVEL, target: 'pino/file' },
  ],
});

export const logger = pino({ level: GLOBAL_LOGGER_LEVEL, timestamp: pino.stdTimeFunctions.isoTime }, transport);

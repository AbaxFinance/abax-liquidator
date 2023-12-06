import winston from 'winston';
import path from 'path';
import 'winston-daily-rotate-file';

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (_, value: unknown) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }
      seen.add(value);
    }
    return value;
  };
};
const prettyMessage = (message: any) => {
  if (message.constructor === Object) {
    return JSON.stringify(message, getCircularReplacer(), 4);
  }
  return message;
};

const actorNamePrefix = process.env.ACTOR_TO_RUN?.toLocaleLowerCase();
const messageFormat = winston.format.printf((info) => `[${actorNamePrefix}] [${info.timestamp}] ${info.level}: ${prettyMessage(info.message)}`);

const fileFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD hh:mm:ss.SSS A',
  }),
  messageFormat,
  winston.format.align(),
);
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({
    format: 'YYYY-MM-DD hh:mm:ss.SSS A',
  }),
  winston.format.align(),
  messageFormat,
);

export const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  level: process.env.LOG_LEVEL?.toLowerCase() || 'info',
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.DailyRotateFile({
      dirname: path.join('/app', 'logs'),
      maxSize: '12m',
      maxFiles: 10,
      zippedArchive: true,
      filename: `${actorNamePrefix}.log`,
      format: fileFormat,
    }),
    new winston.transports.DailyRotateFile({
      dirname: path.join('/app', 'logs'),
      maxSize: '12m',
      maxFiles: 50,
      zippedArchive: true,
      filename: `combined.log`,
      format: fileFormat,
    }),
  ],
});

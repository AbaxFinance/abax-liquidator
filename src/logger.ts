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
  if (message?.constructor === Object) {
    return JSON.stringify(message, getCircularReplacer(), 4);
  }
  return message;
};

const actorNamePrefix = process.env.ACTOR_TO_RUN?.toLocaleLowerCase();
const messageFormat = winston.format.printf((info) => {
  if (info instanceof Error || info.stack || (info?.name as string)?.endsWith('Error')) {
    return `[${actorNamePrefix}] [${info.timestamp}] ${info.level}: ${info.stack}`;
  }
  return `[${actorNamePrefix}] [${info.timestamp}] ${info.level}: ${prettyMessage(info.message)}`;
});
const fileFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD hh:mm:ss.SSS A',
  }),
  winston.format.align(),
  messageFormat,
);
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({
    format: 'YYYY-MM-DD hh:mm:ss.SSS A',
  }),
  winston.format.align(),
  messageFormat,
);

const commontFileTransportOptions = {
  dirname: path.join('/app', 'logs'),
  zippedArchive: true,
  format: fileFormat,
  handleExceptions: true,
  handleRejections: true,
};

export const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  level: process.env.LOG_LEVEL?.toLowerCase() || 'info',
  exitOnError: false,
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
      handleExceptions: true,
      handleRejections: true,
    }),
    new winston.transports.DailyRotateFile({
      ...commontFileTransportOptions,
      maxSize: '12m',
      maxFiles: 10,
      filename: `${actorNamePrefix}.log`,
    }),
    new winston.transports.DailyRotateFile({
      ...commontFileTransportOptions,
      maxSize: '12m',
      maxFiles: 50,
      filename: `combined.log`,
    }),
  ],
});

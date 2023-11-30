import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    winston.format.align(),
    winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'fulllog.log' })],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.simple(),
//     }),
//   );
// }

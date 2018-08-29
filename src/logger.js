import winston from 'winston';

const logger = winston.createLogger();

const winstonLevel = process.env.LOG_LEVEL || 'info';

const winstonBaseFormat = winston.format.combine(
  winston.format.simple(),
  winston.format.splat(),
);

const winstonFormat = process.browser ? winstonBaseFormat : winston.format.combine(
  winston.format.colorize(),
  winstonBaseFormat
);

const winstonConsole = new winston.transports.Console({
  level: winstonLevel,
  format: winstonFormat,
});

logger.add(winstonConsole);
logger.exceptions.handle(winstonConsole);

export default logger;

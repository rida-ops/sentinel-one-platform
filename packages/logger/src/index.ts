import winston from 'winston';

const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'sentinel-one' },
  transports: [
    new winston.transports.Console({
      format: isDevelopment
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(
              ({ level, message, timestamp, ...meta }) =>
                `${timestamp} ${level}: ${message} ${Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : ''}`
            )
          )
        : winston.format.json(),
    }),
    ...(isDevelopment ? [] : [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ]),
  ],
});

export default logger;

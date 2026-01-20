import * as winston from 'winston';

/**
 * Logger interface providing consistent logging methods
 */
export interface Logger {
  /**
   * Logs an informational message
   * @param message - The message to log
   * @param meta - Additional metadata to include
   */
  info(message: string, ...meta: unknown[]): void;

  /**
   * Logs a debug message
   * @param message - The message to log
   * @param meta - Additional metadata to include
   */
  debug(message: string, ...meta: unknown[]): void;

  /**
   * Logs a warning message
   * @param message - The message to log
   * @param meta - Additional metadata to include
   */
  warn(message: string, ...meta: unknown[]): void;

  /**
   * Logs an error message
   * @param message - The message to log
   * @param meta - Additional metadata to include
   */
  error(message: string, ...meta: unknown[]): void;
}

/**
 * Creates and configures a Winston logger instance
 * @returns Configured logger instance
 */
export function createLogger(): Logger {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    defaultMeta: { service: 'graphql-library' },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`;
          })
        ),
      }),
    ],
  });
}

/**
 * Logger utility for Beesides application
 * Provides consistent formatting and control over logging throughout the app
 */

// Log levels for different types of messages
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Current log level - can be changed at runtime or based on environment
let currentLogLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;

// Logger interface
interface Logger {
  debug: (message: string, ...data: any[]) => void;
  info: (message: string, ...data: any[]) => void;
  warn: (message: string, ...data: any[]) => void;
  error: (message: string, ...data: any[]) => void;
}

/**
 * Create a logger instance for a specific module
 * @param module The name of the module (component, service, etc.)
 * @returns A logger object with debug, info, warn, and error methods
 */
export function createLogger(module: string): Logger {
  const formatMessage = (level: string, message: string): string => {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${module}]: ${message}`;
  };

  return {
    debug: (message: string, ...data: any[]) => {
      if (currentLogLevel <= LogLevel.DEBUG) {
        console.debug(formatMessage('DEBUG', message), ...data);
      }
    },
    info: (message: string, ...data: any[]) => {
      if (currentLogLevel <= LogLevel.INFO) {
        console.info(formatMessage('INFO', message), ...data);
      }
    },
    warn: (message: string, ...data: any[]) => {
      if (currentLogLevel <= LogLevel.WARN) {
        console.warn(formatMessage('WARN', message), ...data);
      }
    },
    error: (message: string, ...data: any[]) => {
      if (currentLogLevel <= LogLevel.ERROR) {
        console.error(formatMessage('ERROR', message), ...data);
      }
    },
  };
}

// Helper function to set the global log level
export function setLogLevel(level: LogLevel): void {
  currentLogLevel = level;
}

// Export a default app-wide logger
export const logger = createLogger('app');

/**
 * Simple logger utility for production-ready logging
 * Logs are only shown in development mode
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  error: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.error(message, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(message, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.info(message, ...args);
    }
  },
  debug: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(message, ...args);
    }
  }
};

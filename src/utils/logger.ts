/**
 * @fileoverview Centralized Logger Utility
 * 
 * Provides a structured logging interface that replaces direct console usage.
 * Supports different log levels and can be extended with external logging
 * services like Sentry, LogRocket, or custom backends.
 * 
 * @module utils/logger
 * @author Agent Alex Team
 * @version 1.0.0
 * 
 * @example
 * // Import the logger
 * import { logger } from '../utils/logger';
 * 
 * // Use different log levels
 * logger.info('User logged in', { userId: '123' });
 * logger.warn('Deprecated API called');
 * logger.error('Failed to fetch data', error);
 * logger.debug('Component state', { count: 5 });
 */

/**
 * Logger class providing structured logging with level-based filtering.
 * 
 * Log levels:
 * - **debug**: Detailed debugging information (development only)
 * - **info**: General informational messages (development only)
 * - **warn**: Warning messages for potential issues (development only)
 * - **error**: Error messages (always logged)
 * 
 * @class Logger
 * 
 * @example
 * // The logger is exported as a singleton
 * import { logger } from '../utils/logger';
 * 
 * // Info logging
 * logger.info('Operation completed', { duration: 150 });
 * 
 * // Error logging with Error object
 * try {
 *   await fetchData();
 * } catch (error) {
 *   logger.error('Failed to fetch data', error);
 * }
 */
class Logger {
  /**
   * Flag indicating if the app is running in development mode.
   * @private
   * @type {boolean}
   */
  private isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

  /**
   * Logs informational messages.
   * Only outputs in development mode. Use for general operational information.
   * 
   * @param {string} message - The log message
   * @param {any} [meta] - Optional metadata to include with the log
   * @returns {void}
   * 
   * @example
   * logger.info('User authenticated successfully');
   * logger.info('Data loaded', { count: 50, source: 'api' });
   * logger.info('Component mounted', { component: 'Dashboard' });
   */
  info(message: string, meta?: any): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, meta || '');
    }
    // TODO: Send to logging service in production (e.g., Sentry, LogRocket)
  }

  /**
   * Logs warning messages.
   * Only outputs in development mode. Use for potentially problematic situations.
   * 
   * @param {string} message - The warning message
   * @param {any} [meta] - Optional metadata to include with the log
   * @returns {void}
   * 
   * @example
   * logger.warn('Deprecated method called', { method: 'oldMethod' });
   * logger.warn('Rate limit approaching', { remaining: 10 });
   * logger.warn('Missing optional configuration', { key: 'FEATURE_FLAG' });
   */
  warn(message: string, meta?: any): void {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, meta || '');
    }
    // TODO: Send to logging service in production
  }

  /**
   * Logs error messages.
   * Always outputs regardless of environment. Use for errors and exceptions.
   * 
   * @param {string} message - The error message
   * @param {any} [error] - Optional error object or additional context
   * @returns {void}
   * 
   * @example
   * logger.error('Failed to save data');
   * logger.error('API request failed', error);
   * logger.error('Validation error', { field: 'email', value: 'invalid' });
   * 
   * @example
   * // In a try-catch block
   * try {
   *   await submitForm(data);
   * } catch (error) {
   *   logger.error('Form submission failed', error);
   *   showErrorToast('Please try again');
   * }
   */
  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error || '');
    // TODO: Send to error tracking service (Sentry, etc.)
  }

  /**
   * Logs debug messages.
   * Only outputs in development mode. Use for detailed debugging information.
   * 
   * @param {string} message - The debug message
   * @param {any} [meta] - Optional metadata to include with the log
   * @returns {void}
   * 
   * @example
   * logger.debug('Rendering component', { props });
   * logger.debug('State updated', { before: oldState, after: newState });
   * logger.debug('API response received', { status: 200, data });
   */
  debug(message: string, meta?: any): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, meta || '');
    }
  }
}

/**
 * Singleton logger instance.
 * Import this for all logging needs throughout the application.
 * 
 * @constant {Logger}
 * 
 * @example
 * import { logger } from '../utils/logger';
 * 
 * logger.info('Application started');
 */
export const logger = new Logger();

/**
 * Default export of the logger instance.
 * @default
 */
export default logger;

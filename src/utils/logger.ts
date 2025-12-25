/**
 * Centralized Logger Utility
 * Replaces console.log/error with proper logging
 * Can be extended with external logging services (Sentry, etc.)
 */

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

  /**
   * Log informational messages
   */
  info(message: string, meta?: any): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, meta || '');
    }
    // TODO: Send to logging service in production (e.g., Sentry, LogRocket)
  }

  /**
   * Log warning messages
   */
  warn(message: string, meta?: any): void {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, meta || '');
    }
    // TODO: Send to logging service in production
  }

  /**
   * Log error messages
   */
  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error || '');
    // TODO: Send to error tracking service (Sentry, etc.)
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, meta?: any): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, meta || '');
    }
  }

  /**
   * Create a scoped logger with a prefix (for component-specific logging)
   */
  createLogger(prefix: string): Logger {
    return {
      info: (message: string, meta?: any) => this.info(`[${prefix}] ${message}`, meta),
      warn: (message: string, meta?: any) => this.warn(`[${prefix}] ${message}`, meta),
      error: (message: string, error?: any) => this.error(`[${prefix}] ${message}`, error),
      debug: (message: string, meta?: any) => this.debug(`[${prefix}] ${message}`, meta),
      createLogger: (subPrefix: string) => this.createLogger(`${prefix}:${subPrefix}`)
    } as Logger;
  }
}

// Export singleton instance
export const logger = new Logger();
export default logger;

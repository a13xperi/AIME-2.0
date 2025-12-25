/**
 * Centralized Logger Utility
 * Replaces console.log/error with proper logging
 * Can be extended with external logging services (Sentry, etc.)
 */

export interface LogEvent {
  message: string;
  timestamp: Date | string;
  source?: string;
  level?: 'debug' | 'info' | 'warn' | 'error';
  details?: any;
}

type LogSubscription = (event: LogEvent) => void;

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
  private subscribers: LogSubscription[] = [];

  /**
   * Subscribe to log events
   */
  subscribe(callback: LogSubscription): () => void {
    this.subscribers.push(callback);
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  /**
   * Notify all subscribers of a log event
   */
  private notifySubscribers(event: LogEvent): void {
    this.subscribers.forEach(callback => callback(event));
  }

  /**
   * Log informational messages
   */
  info(message: string, meta?: any): void {
    const event: LogEvent = {
      message,
      timestamp: new Date(),
      level: 'info',
      details: meta
    };
    
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, meta || '');
    }
    this.notifySubscribers(event);
    // TODO: Send to logging service in production (e.g., Sentry, LogRocket)
  }

  /**
   * Log warning messages
   */
  warn(message: string, meta?: any): void {
    const event: LogEvent = {
      message,
      timestamp: new Date(),
      level: 'warn',
      details: meta
    };
    
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, meta || '');
    }
    this.notifySubscribers(event);
    // TODO: Send to logging service in production
  }

  /**
   * Log error messages
   */
  error(message: string, error?: any): void {
    const event: LogEvent = {
      message,
      timestamp: new Date(),
      level: 'error',
      details: error
    };
    
    console.error(`[ERROR] ${message}`, error || '');
    this.notifySubscribers(event);
    // TODO: Send to error tracking service (Sentry, etc.)
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, meta?: any): void {
    const event: LogEvent = {
      message,
      timestamp: new Date(),
      level: 'debug',
      details: meta
    };
    
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, meta || '');
      this.notifySubscribers(event);
    }
  }

  /**
   * Create a scoped logger with a prefix (for component-specific logging)
   */
  createLogger(prefix: string): Logger {
    const baseLogger = this;
    return {
      subscribe: (callback: LogSubscription) => baseLogger.subscribe(callback),
      info: (message: string, meta?: any) => {
        baseLogger.info(`[${prefix}] ${message}`, meta);
      },
      warn: (message: string, meta?: any) => {
        baseLogger.warn(`[${prefix}] ${message}`, meta);
      },
      error: (message: string, error?: any) => {
        baseLogger.error(`[${prefix}] ${message}`, error);
      },
      debug: (message: string, meta?: any) => {
        baseLogger.debug(`[${prefix}] ${message}`, meta);
      },
      createLogger: (subPrefix: string) => baseLogger.createLogger(`${prefix}:${subPrefix}`)
    } as Logger;
  }
}

// Export singleton instance
export const logger = new Logger();
export default logger;

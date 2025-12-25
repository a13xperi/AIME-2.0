/**
 * Tests for Logger Utility
 */

import { logger } from '../logger';

describe('Logger', () => {
  // Save original console methods
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleDebug = console.debug;

  beforeEach(() => {
    // Mock console methods
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.debug = jest.fn();
  });

  afterEach(() => {
    // Restore original console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.debug = originalConsoleDebug;
  });

  describe('info', () => {
    it('should log info messages in development', () => {
      logger.info('Test info message');

      expect(console.log).toHaveBeenCalledWith('[INFO] Test info message', '');
    });

    it('should include metadata when provided', () => {
      logger.info('Test with meta', { user: 'test' });

      expect(console.log).toHaveBeenCalledWith('[INFO] Test with meta', { user: 'test' });
    });
  });

  describe('error', () => {
    it('should always log error messages', () => {
      logger.error('Test error message');

      expect(console.error).toHaveBeenCalledWith('[ERROR] Test error message', '');
    });

    it('should log error with error object', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error);

      expect(console.error).toHaveBeenCalledWith('[ERROR] Error occurred', error);
    });
  });

  describe('warn', () => {
    it('should log warning messages in development', () => {
      logger.warn('Test warning');

      expect(console.warn).toHaveBeenCalledWith('[WARN] Test warning', '');
    });
  });

  describe('debug', () => {
    it('should log debug messages only in development/test', () => {
      // eslint-disable-next-line testing-library/no-debugging-utils
      logger.debug('Debug message');

      expect(console.debug).toHaveBeenCalledWith('[DEBUG] Debug message', '');
    });
  });
});

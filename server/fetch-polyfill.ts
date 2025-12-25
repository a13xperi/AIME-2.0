// Polyfill fetch for TypeScript compilation
// Node.js 18+ has fetch built-in, but TypeScript needs this declaration
import { RequestInfo, RequestInit, Response } from 'node-fetch';

declare global {
  function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
}

export {};
